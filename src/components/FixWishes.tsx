import React from "react";
import { Wish } from "../types/types";
import { Container } from "./common/Container";
import firebase from "./firebase/firebase";
import { parse } from "date-fns";
import { isUndefined } from "util";

export const FixWishes = () => {
  async function go() {
    const allWishes = await firebase.firestore().collection("wish").get();
    allWishes.docs.forEach(async (m) => {
      const ref = firebase.firestore().collection("wish").doc(m.id);

      const data = await ref.get();

      if (data.data()?.date !== undefined) {
        console.log("date not null. Doing nothing");
        return;
      } else {
        console.log("date undefined - setting date");
        ref.update({
          date: firebase.firestore.Timestamp.fromDate(
            parse("2020-11-01", "yyyy-MM-dd", new Date())
          ),
        });
      }
    });
  }

  return (
    <Container>
      <button onClick={go}>Go</button>
    </Container>
  );
};
