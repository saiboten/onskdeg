import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import Icon from "../common/Icon";

import { setWishes, storeOwnWishesToFirebase } from "../../state/actions/wish";
import { Wish as WishType, User, FirebaseSnapshot } from "../../types/types";
import Container from "../common/Container";
import { BorderButton } from "../common/Button";
import { Link } from "../common/Link";

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

const StyledInput = styled.input`
  height: 48px;
  padding: 0 10px;
  padding-left: 40px;
  width: calc(100% - 1.6rem);
  margin: 0 0.8rem;
  border-radius: 10px;
  border: none;
  @media only screen and (min-width: 37.5em) {
    flex: 1 0 70%;
  }
`;

const StyledBottomOptions = styled.div`
  width: 100%;
  text-align: left;
  margin-top: 10px;
`;

export const YourWishList = () => {
  let firebaseRef: any;

  const [newWish, setNewWish] = useState("");
  const [feedback, setFeedback] = useState("");

  const selector = useSelector(
    ({ wish: { wishes }, user }: { wish: any; user: User }) => {
      return {
        wishes: wishes[user.uid] ? wishes[user.uid] : [],
        user
      };
    }
  );

  const { user, wishes } = selector;
  const dispatch = useDispatch();

  function updateWishStore(newData: Array<WishType>) {
    dispatch(setWishes(newData));
  }
  function storeWishesToFirebase(newData: Array<WishType>) {
    dispatch(storeOwnWishesToFirebase(newData));
  }

  useEffect(() => {
    firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

    firebaseRef.on("value", (snapshot: FirebaseSnapshot) => {
      updateWishStore(snapshot.val());
    });

    return () => {
      firebaseRef.off();
    };
  }, []);

  /*eslint-disable */
  function createGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
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

    const newWishList = Object.assign([], wishes);
    newWishList.unshift({
      name: newWish,
      id: createGuid(),
      image: "",
      accomplished: false,
      accomplishedby: "",
      deleted: false,
      description: "",
      link: ""
    });

    storeWishesToFirebase(newWishList);
    setFeedback("");
    setNewWish("");
  }

  function update(wish: WishType) {
    const newWishList = wishes.map((e: WishType) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image: wish.image ? wish.image : "",
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  function addImage(wish: WishType, image: string) {
    const newWishList = wishes.map((e: WishType) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image,
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  function deleteThis(deleteId: string) {
    const newWishList = Object.assign([], wishes);

    const filteredNewWishList = newWishList.filter((e: WishType) => {
      return e.id !== deleteId;
    });

    storeWishesToFirebase(filteredNewWishList);
  }

  const wishesEl = wishes.map((el: WishType) => {
    return (
      <Wish
        key={el.id}
        update={update}
        delete={deleteThis}
        addImage={addImage}
        wish={el}
      />
    );
  });

  return (
    <Container>
      <StyledWrapper onSubmit={addWish}>
        <StyledInput
          type="text"
          placeholder="Legg inn nye ønsker her"
          value={newWish}
          onChange={e => setNewWish(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
        {feedback && <div>{feedback}</div>}
      </StyledWrapper>

      <div className="your-wishlist__wishlist">{wishesEl}</div>
      <StyledBottomOptions>
        <BorderButton>
          <Link to={`/guardians`}>Konfigurer andre</Link>
        </BorderButton>
      </StyledBottomOptions>
    </Container>
  );
};
