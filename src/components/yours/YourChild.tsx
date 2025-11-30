import React, { useState } from "react";
import styled from "styled-components";
import { Wish as WishType, Child, NewsEntryType } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { Wish } from "./Wish";
import { StyledWrapper } from "./YourWishList";
import firebase from "../firebase/firebase";
import { useWishes } from "../../hooks/useWishes";
import { mutate } from "swr";
import Loading from "../common/Loading";
import { useUser } from "../../hooks/useUser";
import { getOgData, OgResponseData } from "../../util/getOgData";
import { EmptyButton } from "../common/EmptyButton";
import { Check } from "lucide-react";

const StyledChildren = styled.div`
  margin-bottom: 2.4rem;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
`;

interface Props {
  child: Child;
  myUid: string;
}

export const YourChild = ({ child, myUid }: Props) => {
  const [newWish, setNewWish] = useState("");
  const { wishes, isLoading } = useWishes(child.uid);
  const { user } = useUser(myUid);

  async function deleteWish(deleteId: string) {
    await firebase.firestore().collection("wish").doc(deleteId).delete();
    mutate(["wish", child?.uid]);
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={child.uid} key={el.id} delete={deleteWish} wish={el} />;
  };

  const handleSaveWish = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(["wish", child?.uid], [{ name: newWish }, ...(wishes || [])], false);
    setNewWish("");

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined = undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const emptyWish: WishType = {
      owner: child.uid,
      name: data?.title || newWish,
      deleted: false,
      description: data?.description || "",
      image: data?.image || "",
      link: link || "",
      isSuggestion: false,
      id: "",
      date: firebase.firestore.Timestamp.now(),
    };

    const newWishRef = await firebase
      .firestore()
      .collection("wish")
      .add(emptyWish);

    await newWishRef.update({
      id: newWishRef.id,
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

    mutate(["wish", child.uid]);
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
        <EmptyButton type="submit" name="check">
          <IconWrapper>
            <Check size={24} />
          </IconWrapper>
        </EmptyButton>
      </StyledWrapper>
      {(wishes ?? []).length > 0 ? (
        (wishes ?? []).map(wishToElement)
      ) : (
        <div>Ingen ønsker lagt inn enda</div>
      )}
    </StyledChildren>
  );
};
