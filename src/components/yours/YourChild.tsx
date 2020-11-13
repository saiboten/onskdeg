import React, { useState } from "react";
import styled from "styled-components";
import { Wish as WishType, Child } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { Wish } from "./Wish";
import { StyledWrapper, StyledCheckIcon } from "./YourWishList";
import firebase from "../firebase/firebase";
import { useWishes } from "../../hooks/useWishes";
import { mutate } from "swr";
import { createGuid } from "../../util/guid";

const StyledChildren = styled.div`
  margin-bottom: 2.4rem;
`;

interface Props {
  child: Child;
}

export const YourChild = ({ child }: Props) => {
  const [newWish, setNewWish] = useState("");
  const { wishes, isLoading } = useWishes(child.uid);

  const wishToElement = (el: WishType) => {
    return (
      <Wish
        user={child.uid}
        key={el.id}
        delete={() => console.log("updating")}
        wish={el}
      />
    );
  };

  const handleSaveWish = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyWish: WishType = {
      name: newWish,
      accomplished: false,
      accomplishedby: "",
      deleted: false,
      description: "",
      image: "",
      link: "",
      id: createGuid(),
    };

    firebase
      .firestore()
      .collection("wishes")
      .doc(child.uid)
      .update({
        wishes: [...(wishes || []), emptyWish],
      });
    mutate(["wishes", child.uid]);
  };

  if (isLoading) {
    return <div>Laster ønsker</div>;
  }

  return (
    <StyledChildren>
      <h2>{child.name}</h2>
      <StyledWrapper onSubmit={handleSaveWish}>
        <StyledInput
          type="text"
          placeholder={`Legg inn nye ønsker for ${child.name}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
      </StyledWrapper>
      {(wishes || []).length > 0 ? (
        (wishes || []).map(wishToElement)
      ) : (
        <div>Ingen ønsker lagt inn enda</div>
      )}
    </StyledChildren>
  );
};
