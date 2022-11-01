import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import { mutate } from "swr";

import { Wish as WishType, User, NewsEntryType } from "../../types/types";
import { Container } from "../common/Container";

import { StyledInput } from "../common/StyledInput";
import { useUser } from "../../hooks/useUser";
import { useWishes } from "../../hooks/useWishes";
import { useInvites } from "../../hooks/useInvites";
import { Spacer } from "../common/Spacer";
import { useChilds } from "../../hooks/useChilds";
import { YourChild } from "./YourChild";
import { InvitePopup } from "./InvitePopup";
import Loading from "../common/Loading";
import { SelectName } from "../SelectName";
import { StyledBigHeader } from "../common/StyledHeading";
import { getOgData, OgResponseData } from "../../util/getOgData";
import { redirect } from "react-router-dom";
import { Notifications } from "./Notifications";
import { ReactComponent as CheckIcon } from "../images/checkmark_new.svg";
import { EmptyButton } from "../common/EmptyButton";

export const StyledCheckIcon = styled(CheckIcon)`
  fill: ${(props) => props.theme.secondary};
`;

interface P {
  user: User;
  updateWishStore: (newWishes: Array<WishType>) => void;
  storeWishesToFirebase: (newWishes: Array<WishType>) => void;
  wishes: Array<WishType>;
  firebaseUser: firebase.User;
}

interface S {
  newWish: string;
  feedback: string;
}

export const StyledWrapper = styled.form`
  position: relative;
  margin: 0 auto;
  margin-bottom: 0.8rem;
  width: 60%;

  @media (max-width: 450px) {
    width: 100%;
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

  useEffect(() => {
    if (!user?.email && firebaseUser?.email) {
      firebase.firestore().collection("user").doc(uid).update({
        email: firebaseUser?.email,
      });
    }
  }, []);

  const { wishes } = useWishes(user?.uid ?? "");

  const childs = useChilds(user?.uid ?? "");

  const { invites } = useInvites(firebaseUser?.email ?? "");

  async function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    mutate(["wish", user?.uid], [{ name: newWish }, ...(wishes || [])], false);
    setNewWish("");

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const newWishObject: WishType = {
      owner: uid,
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

    mutate(["wish", user?.uid]);

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: false,
        user: user.uid,
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
      redirect(`wish/${uid}/${newWishRef.id}`);
    }
  }

  async function deleteThis(deleteId: string) {
    await firebase.firestore().collection("wish").doc(deleteId).delete();
    mutate(["wish", user?.uid]);
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={uid} key={el.id} delete={deleteThis} wish={el} />;
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

      <StyledWrapper onSubmit={addWish}>
        <StyledInput
          type="text"
          placeholder="Legg inn ønske her"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />

        <EmptyButton type="submit" name="check">
          <StyledCheckIcon />
        </EmptyButton>

        {feedback && <div>{feedback}</div>}
      </StyledWrapper>
      <div>
        {wishes?.filter((el) => !el.isSuggestion).map(wishToElement) ?? []}
      </div>
      <Spacer />
      <Suspense fallback={<div>Laster barn</div>}>
        {childs?.map((child) => {
          return <YourChild key={child.uid} myUid={uid} child={child} />;
        })}
      </Suspense>
    </Container>
  );
};
