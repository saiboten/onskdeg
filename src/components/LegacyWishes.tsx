import { useEffect, useState } from "react";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
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
      <StyledBigHeader>Ønsker fra gamledager</StyledBigHeader>
      <ul className="list-disc pl-24">
        {wishes?.map((wish, index) => (
          <li key={index}>{wish}</li>
        ))}
      </ul>
    </Container>
  );
};
