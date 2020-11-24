import React, { useState } from "react";
import styled from "styled-components";
import { Wish as WishType, Child, NewsEntryType } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { Wish } from "./Wish";
import { StyledWrapper, StyledCheckIcon } from "./YourWishList";
import firebase from "../firebase/firebase";
import { useWishes } from "../../hooks/useWishes";
import { mutate } from "swr";
import { createGuid } from "../../util/guid";
import Loading from "../common/Loading";
import { useUser } from "../../hooks/useUser";
import { getOgData, OgResponseData } from "../../util/getOgData";

const StyledChildren = styled.div`
  margin-bottom: 2.4rem;
`;

interface Props {
  child: Child;
  myUid: string;
}

export const YourChild = ({ child, myUid }: Props) => {
  const [newWish, setNewWish] = useState("");
  const { wishes, isLoading } = useWishes(child.uid, true);
  const { user } = useUser(myUid);

  function storeWishesToFirebase(newData: Array<WishType>) {
    mutate(["wishes", child?.uid || "?"], newData, false);
    firebase
      .firestore()
      .collection("wishes")
      .doc(child?.uid || "?")
      .set({
        wishes: newData,
      })
      .then(() => {
        mutate(["wishes", child?.uid]);
      });
  }

  function deleteWish(deleteId: string) {
    storeWishesToFirebase(
      [...(wishes ?? [])].filter((e: WishType) => {
        return e.id !== deleteId;
      })
    );
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={child.uid} key={el.id} delete={deleteWish} wish={el} />;
  };

  const handleSaveWish = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined = undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const emptyWish: WishType = {
      name: data?.title || newWish,
      deleted: false,
      description: data?.description || "",
      image: data?.image || "",
      link: link || "",
      isSuggestion: false,
      id: createGuid(),
      date: firebase.firestore.Timestamp.now(),
    };

    firebase
      .firestore()
      .collection("wishes")
      .doc(child.uid)
      .update({
        wishes: [emptyWish, ...(wishes ?? [])],
      });

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: false,
        user: child.uid,
        wish: data?.title || newWish,
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    mutate(["wishes", child.uid]);
    setNewWish("");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <StyledChildren>
      <h2>{child.name}</h2>
      <StyledWrapper onSubmit={handleSaveWish}>
        <StyledInput
          type="text"
          placeholder={`Legg inn ønske for ${child.name}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
      </StyledWrapper>
      {(wishes ?? []).length > 0 ? (
        (wishes ?? []).map(wishToElement)
      ) : (
        <div>Ingen ønsker lagt inn enda</div>
      )}
    </StyledChildren>
  );
};
