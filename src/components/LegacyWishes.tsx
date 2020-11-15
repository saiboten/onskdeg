import React, { useEffect, useState } from "react";
import { Container } from "./common/Container";
import firebase from "./firebase/firebase";

export const LegacyWishes = ({ uid }: { uid: string }) => {
  const [wishes, setWishes] = useState<string[]>();

  useEffect(() => {
    firebase
      .database()
      .ref("/wishes/" + uid)
      .once("value")
      .then(function (snapshot) {
        var wishes = snapshot.val() && snapshot.val().wishes;
        setWishes(wishes.map((el: any) => el.name));
      });
  }, [uid]);
  return (
    <Container textLeft>
      <h1>Ønsker fra gamledager</h1>
      <ul>
        {wishes?.map((wish, index) => (
          <li key={index}>{wish}</li>
        ))}
      </ul>
    </Container>
  );
};
