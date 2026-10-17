import { ComponentProps, Suspense, useEffect, useState } from "react";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import { invalidate, queryClient } from "../../queryClient";

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
import { Check, Upload } from "lucide-react";
import { EmptyButton } from "../common/EmptyButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvitePopup } from "./InvitePopup";
import { TabContainer, Tab } from "../common/Tabs";

export const StyledWrapper = (props: ComponentProps<"form">) => (
  <form
    className="mx-auto mb-8 flex w-[60%] items-center gap-8 max-[450px]:w-full"
    {...props}
  />
);

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
  const activeTab = searchParams.get("tab") || uid;

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

  const activeUser =
    activeTab === uid ? user : childs?.find((c) => c.uid === activeTab);

  async function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    queryClient.setQueryData(
      ["wish", activeTab],
      [{ name: newWish }, ...(wishes || [])]
    );
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

    invalidate(["wish", activeTab]);

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
    invalidate(["wish", activeTab]);
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={activeTab} key={el.id} delete={deleteThis} wish={el} />;
  };

  const sortedWishes = wishes
    ?.filter((el) => !el.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });

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
          <Tab $active={activeTab === uid} onClick={() => handleTabChange(uid)}>
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
          placeholder={`Legg inn ønske ${activeUser?.name ? `for ${activeUser.name}` : "her"}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />

        <EmptyButton type="submit" name="check">
          <span className="flex items-center justify-center text-text">
            <Check size={24} />
          </span>
        </EmptyButton>

        <EmptyButton
          type="button"
          name="upload"
          onClick={() => navigate("/upload-wishes")}
        >
          <span className="flex items-center justify-center text-text">
            <Upload size={24} />
          </span>
        </EmptyButton>

        {feedback && <div>{feedback}</div>}
      </StyledWrapper>
      <div>{sortedWishes?.map(wishToElement) ?? []}</div>
      <Spacer />
    </Container>
  );
};
