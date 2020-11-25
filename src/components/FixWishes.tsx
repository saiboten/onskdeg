import React from "react";
import { Wish } from "../types/types";
import { Container } from "./common/Container";
import firebase from "./firebase/firebase";

export const FixWishes = () => {
  async function go() {
    const allWishes = await firebase.firestore().collection("wishes").get();
    allWishes.docs.forEach((m) => {
      const wishList: Wish[] = [...(m.data()?.wishes || [])];

      wishList.forEach(async (wish) => {
        const newWish: Wish = {
          ...wish,
          owner: m.id,
        };

        delete newWish.wishes;

        const ref = await firebase.firestore().collection("wish").add(newWish);
        await ref.update({
          id: ref.id,
        });
      });
    });
  }

  return (
    <Container>
      <button onClick={go}>Go</button>
    </Container>
  );
};
