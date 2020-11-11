import React, { useState } from "react";
import styled from "styled-components";
import { Child } from "../../types/types";
import { Wish as WishType } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { Wish } from "./Wish";
import { StyledWrapper, StyledCheckIcon } from "./YourWishList";
import firebase from "../firebase/firebase";
import { useWishes } from "../../hooks/useWishes";
import { mutate } from "swr";

const StyledChildren = styled.div`
  margin-bottom: 2.4rem;
`;

interface Props {
  child: Child;
}

export const YourChild = ({ child }: Props) => {
  const [newWish, setNewWish] = useState("");
  const { wishes, isLoading } = useWishes(child.id);

  const wishToElement = (el: WishType) => {
    return (
      <Wish
        key={el.id}
        update={() => console.log("updating")}
        delete={() => console.log("updating")}
        addImage={() => console.log("updating")}
        wish={el}
      />
    );
  };

  const handleSaveWish = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("wishes")
      .doc(child.id)
      .update({
        wishes: [...(wishes || []), newWish],
      });
    mutate(["wishes", child.id]);
  };

  if (isLoading) {
    return <div>Laster ønsker</div>;
  }

  return (
    <StyledChildren>
      <h2>{child.name}</h2>
      {(wishes || []).length > 0 ? (
        (wishes || []).map(wishToElement)
      ) : (
        <div>Ingen ønsker lagt inn enda</div>
      )}
      <StyledWrapper onClick={handleSaveWish}>
        <StyledInput
          type="text"
          placeholder={`Legg inn nye ønsker for ${child.name}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
      </StyledWrapper>
    </StyledChildren>
  );
};
