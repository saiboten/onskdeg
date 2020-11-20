import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import Icon from "../common/Icon";
import { mutate } from "swr";

import {
  Wish as WishType,
  User,
  FirebaseSnapshot,
  Kohort,
  NewsEntryType,
} from "../../types/types";
import { Container } from "../common/Container";
import { BorderButton } from "../common/Button";
import { Link } from "../common/Link";
import { StyledInput } from "../common/StyledInput";
import { useUser } from "../../hooks/useUser";
import { useWishes } from "../../hooks/useWishes";
import { useInvites } from "../../hooks/useInvites";
import { Spacer } from "../common/Spacer";
import { useChilds } from "../../hooks/useChilds";
import { YourChild } from "./YourChild";
import { createGuid } from "../../util/guid";
import { InvitePopup } from "./InvitePopup";
import Loading from "../common/Loading";
import { SelectName } from "../SelectName";
import { StyledBigHeader } from "../common/StyledHeading";
import { getOgData, OgResponseData } from "../../util/getOgData";

export const StyledCheckIcon = styled(Icon)`
  position: absolute;
  color: black;
  top: 0;
  left: 15px;
  height: 100%;
  background-color: transparent;
  border: none;
  float: right;
  cursor: pointer;
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
  margin-bottom: 0.8rem;
`;

const StyledBottomOptions = styled.div`
  width: 100%;
  text-align: left;
`;

interface Props {
  uid: string;
  firebaseUser?: firebase.User;
}

export const YourWishList = ({ uid, firebaseUser }: Props) => {
  const [newWish, setNewWish] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useUser(uid);

  const { wishes } = useWishes(user?.uid || "?");

  const childs = useChilds(user?.uid || "?");

  const { invites } = useInvites(firebaseUser?.email || "");

  function storeWishesToFirebase(newData: Array<WishType>) {
    mutate(["wishes", user?.uid || "?"], newData, false);
    firebase
      .firestore()
      .collection("wishes")
      .doc(user?.uid || "?")
      .set({
        wishes: newData,
      })
      .then(() => {
        mutate(["wishes", user?.uid]);
      });
  }

  async function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const newWishObject: WishType = {
      name: data?.title || newWish,
      id: createGuid(),
      image: data?.image || "",
      deleted: false,
      description: data?.description || "",
      link: link || "",
      isSuggestion: false,
      date: firebase.firestore.Timestamp.now(),
    };

    const newWishList = [newWishObject, ...(wishes || [])];

    storeWishesToFirebase(newWishList);

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed || [];
      newsFeed.unshift({
        isSuggestion: false,
        user: user.uid,
        wish: data?.title || newWish,
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) || [],
      });
    });

    setFeedback("");
    setNewWish("");
  }

  function deleteThis(deleteId: string) {
    storeWishesToFirebase(
      [...(wishes || [])].filter((e: WishType) => {
        return e.id !== deleteId;
      })
    );
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
          invites={invites?.myInvites || []}
        />
      )}
      <StyledBigHeader>Mine ønsker</StyledBigHeader>

      <StyledWrapper onSubmit={addWish}>
        <StyledInput
          type="text"
          placeholder="Legg inn ønske her"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
        {feedback && <div>{feedback}</div>}
      </StyledWrapper>
      <div>
        {wishes?.filter((el) => !el.isSuggestion).map(wishToElement) || []}
      </div>
      <Spacer />
      <Suspense fallback={<div>Laster barn</div>}>
        {childs?.map((child) => {
          return <YourChild key={child.uid} myUid={uid} child={child} />;
        })}
      </Suspense>
      <Spacer />
      <StyledBottomOptions>
        <BorderButton>
          <Link to={`/addchild`}>Legg til ekstra bruker</Link>
        </BorderButton>
        <BorderButton
          style={{
            marginLeft: "1rem",
          }}
        >
          <Link to={`/legacy`}>Se tidligere ønsker</Link>
        </BorderButton>
      </StyledBottomOptions>
    </Container>
  );
};
