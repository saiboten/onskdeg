import { useEffect, useState } from "react";
import { Container } from "./common/Container";
import { PageHeader } from "./common/Page";
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
    <Container>
      <PageHeader title="Ønsker fra gamledager" />
      <ul className="flex list-none flex-col gap-8">
        {wishes?.map((wish, index) => (
          <li key={index} className="rounded-[12px] bg-primary px-16 py-12">
            {wish}
          </li>
        ))}
      </ul>
    </Container>
  );
};
