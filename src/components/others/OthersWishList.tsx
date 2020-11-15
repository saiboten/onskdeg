import React, { useState } from "react";
import styled from "styled-components";

import { Container } from "../common/Container";
import OtherWish from "./OtherWish";
import { useWishes } from "../../hooks/useWishes";
import { useParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader } from "../common/StyledHeading";
import { StyledInput } from "../common/StyledInput";
import { Spacer } from "../common/Spacer";
import { StyledCheckIcon } from "../yours/YourWishList";
import firebase from "../firebase/firebase";
import { Wish } from "../../types/types";
import { createGuid } from "../../util/guid";
import { StyledNotification } from "../common/StyledNotification";
import { mutate } from "swr";

interface Params {
  uid: string;
}

export const StyledWrapper = styled.form`
  position: relative;
  margin-bottom: 0.8rem;
`;

export const OthersWishList = ({ myUid }: { myUid: string }) => {
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const { uid } = useParams<Params>();
  const { user } = useUser(uid);

  const { wishes } = useWishes(uid);

  async function handleAddSuggestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newWish: Wish = {
      deleted: false,
      description: "",
      id: createGuid(),
      image: "",
      isSuggestion: true,
      name: suggestion,
      link: "",
      suggestedBy: myUid,
    };

    const docRef = firebase.firestore().collection("wishes").doc(uid);
    const existingData = await (await docRef.get()).data()?.wishes;

    docRef.update({
      wishes: [newWish, ...existingData],
    });

    setFeedback(`Lag til forslag ${suggestion}`);
    setSuggestion("");
    mutate(["wishes", uid]);

    setTimeout(() => {
      setFeedback("");
    }, 3000);
  }

  const ownWishes = wishes?.filter((m) => !m.isSuggestion);

  const suggestions = wishes?.filter((m) => m.isSuggestion);

  return (
    <Container>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <StyledBigHeader>{`Ønskelisten til ${user?.name}`}</StyledBigHeader>
      {ownWishes?.length === 0 && <p>Ingen ønsker enda.</p>}
      {ownWishes?.map((wish) => (
        <OtherWish myUid={myUid} key={wish.id} user={uid} wishInfo={wish} />
      ))}
      <Spacer />
      <StyledBigHeader>Forslag for {user?.name}</StyledBigHeader>
      {suggestions?.map((wish) => (
        <OtherWish myUid={myUid} key={wish.id} user={uid} wishInfo={wish} />
      ))}
      <Spacer />
      <h3>Legg inn forslag til {user?.name}</h3>
      <Spacer />
      <StyledWrapper onSubmit={handleAddSuggestion}>
        <StyledInput
          type="text"
          placeholder="Legg inn forslag her"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <StyledCheckIcon type="submit" name="check" onClick={() => null} />
      </StyledWrapper>
    </Container>
  );
};
