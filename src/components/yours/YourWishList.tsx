import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import { mutate } from "swr";

import { Wish as WishType, NewsEntryType } from "../../types/types";
import { Container } from "../common/Container";

import { StyledInput } from "../common/StyledInput";
import { useUser } from "../../hooks/useUser";
import { useWishes } from "../../hooks/useWishes";
import { useInvites } from "../../hooks/useInvites";
import { Spacer } from "../common/Spacer";
import { useChilds } from "../../hooks/useChilds";
import Loading from "../common/Loading";
import { SelectName } from "../SelectName";
import { StyledBigHeader } from "../common/StyledHeading";
import { getOgData, OgResponseData } from "../../util/getOgData";
import { redirect } from "react-router-dom";
import { Notifications } from "./Notifications";
import CheckIcon from "../images/checkmark_new.svg?react";
import UploadIcon from "../images/upload.svg?react";
import { EmptyButton } from "../common/EmptyButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvitePopup } from "./InvitePopup";

export const StyledCheckIcon = styled(CheckIcon)`
  fill: ${(props) => props.theme.secondary};
`;

export const StyledUploadIcon = styled(UploadIcon)`
  fill: ${(props) => props.theme.secondary};
  width: 24px;
  height: 24px;
`;

export const StyledWrapper = styled.form`
  margin: 0 auto;
  margin-bottom: 0.8rem;
  width: 60%;
  display: flex;
  gap: 0.8rem;
  align-items: center;

  @media (max-width: 450px) {
    width: 100%;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 2rem;
  border: 2px solid ${(props) => props.theme.secondary};
  background: ${(props) => props.$active ? props.theme.secondary : 'transparent'};
  color: ${(props) => props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: ${(props) => props.$active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface Props {
  uid: string;
  firebaseUser?: firebase.User;
}

export const YourWishList = ({ uid, firebaseUser }: Props) => {
  const [newWish, setNewWish] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useUser(uid);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const childs = useChilds(user?.uid ?? "");
  const activeTab = searchParams.get('tab') || uid;

  useEffect(() => {
    if (!user?.email && firebaseUser?.email) {
      firebase.firestore().collection("user").doc(uid).update({
        email: firebaseUser?.email,
      });
    }
  }, []);

  const { wishes } = useWishes(activeTab);

  const { invites } = useInvites(firebaseUser?.email ?? "");

  const handleTabChange = (tabUid: string) => {
    setSearchParams({ tab: tabUid });
  };

  const activeUser = activeTab === uid ? user : childs?.find(c => c.uid === activeTab);

  async function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    mutate(["wish", activeTab], [{ name: newWish }, ...(wishes || [])], false);
    setNewWish("");

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const newWishObject: WishType = {
      owner: activeTab,
      name: data?.title || newWish,
      id: "",
      image: data?.image || "",
      deleted: false,
      description: data?.description || "",
      link: link || "",
      isSuggestion: false,
      date: firebase.firestore.Timestamp.now(),
    };

    const newWishRef = await firebase
      .firestore()
      .collection("wish")
      .add(newWishObject);

    newWishRef.update({
      id: newWishRef.id,
    });

    mutate(["wish", activeTab]);

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: false,
        user: activeTab,
        wish: data?.title || newWish,
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    setFeedback("");
    setNewWish("");

    if (data) {
      redirect(`wish/${activeTab}/${newWishRef.id}`);
    }
  }

  async function deleteThis(deleteId: string) {
    await firebase.firestore().collection("wish").doc(deleteId).delete();
    mutate(["wish", activeTab]);
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={activeTab} key={el.id} delete={deleteThis} wish={el} />;
  };

  if (!user?.name) {
    return (
      <Suspense fallback={<Loading />}>
        <SelectName uid={uid} firebaseUser={firebaseUser} />
      </Suspense>
    );
  }

  return (
    <Container>
      {(invites?.myInvites.length || 0) > 0 && (
        <InvitePopup
          firebaseUser={firebaseUser}
          uid={uid}
          invites={invites?.myInvites ?? []}
        />
      )}

      <Notifications myUid={uid} />

      <StyledBigHeader>Mine ønsker</StyledBigHeader>

      {childs && childs.length > 0 && (
        <TabContainer>
          <Tab
            $active={activeTab === uid}
            onClick={() => handleTabChange(uid)}
          >
            {user?.name}
          </Tab>
          {childs.map((child) => (
            <Tab
              key={child.uid}
              $active={activeTab === child.uid}
              onClick={() => handleTabChange(child.uid)}
            >
              {child.name}
            </Tab>
          ))}
        </TabContainer>
      )}

      <StyledWrapper onSubmit={addWish}>
        <StyledInput
          type="text"
          placeholder={`Legg inn ønske ${activeUser?.name ? `for ${activeUser.name}` : 'her'}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />

        <EmptyButton type="submit" name="check">
          <StyledCheckIcon />
        </EmptyButton>

        <EmptyButton type="button" name="upload" onClick={() => navigate("/upload-wishes")}>
          <StyledUploadIcon />
        </EmptyButton>

        {feedback && <div>{feedback}</div>}
      </StyledWrapper>
      <div>
        {wishes?.filter((el) => !el.isSuggestion).map(wishToElement) ?? []}
      </div>
      <Spacer />
    </Container>
  );
};
