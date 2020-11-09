import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import Icon from "../common/Icon";
import { mutate } from "swr";

import { Wish as WishType, User, FirebaseSnapshot } from "../../types/types";
import Container from "../common/Container";
import { BorderButton } from "../common/Button";
import { Link } from "../common/Link";
import { StyledInput } from "../common/StyledInput";
import { useWish } from "../../hooks/useWish";
import { useUser } from "../../hooks/useUser";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { useWishes } from "../../hooks/useWishes";

const StyledCheckIcon = styled(Icon)`
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
}

interface S {
  newWish: string;
  feedback: string;
}

const StyledWrapper = styled.form`
  position: relative;
  margin-bottom: 0.8rem;
`;

const StyledBottomOptions = styled.div`
  width: 100%;
  text-align: left;
  margin-top: 10px;
`;

interface Props {
  user: User;
}

export const YourWishList = ({ user }: Props) => {
  const [newWish, setNewWish] = useState("");
  const [feedback, setFeedback] = useState("");

  const { wishes } = useWishes(user.uid);

  function storeWishesToFirebase(newData: Array<WishType>) {
    mutate(["wishes", user.uid], newData, false);
    firebase
      .firestore()
      .collection("wishes")
      .doc(user.uid)
      .set({
        wishes: newData,
      })
      .then(() => {
        mutate(["wishes", user.uid]);
      });
  }

  /*eslint-disable */
  function createGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  /* eslint-enable */

  function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    const newWishList = [
      ...(wishes || []),
      {
        name: newWish,
        id: createGuid(),
        image: "",
        accomplished: false,
        accomplishedby: "",
        deleted: false,
        description: "",
        link: "",
      },
    ];

    storeWishesToFirebase(newWishList);
    setFeedback("");
    setNewWish("");
  }

  function update(wish: WishType) {
    // Update wish
  }

  function addImage(wish: WishType, image: string) {
    // Add image
  }

  function deleteThis(deleteId: string) {
    const newWishList = Object.assign([], wishes);

    const filteredNewWishList = newWishList.filter((e: WishType) => {
      return e.id !== deleteId;
    });

    storeWishesToFirebase(filteredNewWishList);
  }

  const wishesEl =
    wishes?.map((el: WishType) => {
      return (
        <Wish
          key={el.id}
          update={update}
          delete={deleteThis}
          addImage={addImage}
          wish={el}
        />
      );
    }) || [];

  return (
    <Container>
      <StyledWrapper onSubmit={addWish}>
        <StyledInput
          type="text"
          placeholder="Legg inn nye ønsker her"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
        {feedback && <div>{feedback}</div>}
      </StyledWrapper>

      <div>{wishesEl}</div>
      <StyledBottomOptions>
        <BorderButton>
          <Link to={`/guardians`}>Konfigurer andre</Link>
        </BorderButton>
      </StyledBottomOptions>
    </Container>
  );
};
