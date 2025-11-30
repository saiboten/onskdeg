import React, { useState } from "react";
import styled from "styled-components";

import { Container } from "../common/Container";
import OtherWish from "./OtherWish";
import { useWishes } from "../../hooks/useWishes";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader } from "../common/StyledHeading";
import { StyledInput } from "../common/StyledInput";
import { Spacer } from "../common/Spacer";
import firebase from "../firebase/firebase";
import { NewsEntryType, Wish } from "../../types/types";
import { StyledNotification } from "../common/StyledNotification";
import { mutate } from "swr";
import { getOgData, OgResponseData } from "../../util/getOgData";
import { EmptyButton } from "../common/EmptyButton";
import { Check } from "lucide-react";

interface Params {
  uid: string;
  [id: string]: string | undefined;
}

export const StyledWrapper = styled.form`
  position: relative;
  margin-bottom: 0.8rem;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
`;

export const OthersWishList = ({ myUid }: { myUid: string }) => {
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const { uid } = useParams<Params>();
  const { user } = useUser(uid ?? "");
  const { wishes } = useWishes(uid ?? "");

  async function handleAddSuggestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // mutate(["wish", uid], [{ name: suggestion }, ...(wishes || [])], false);

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined = undefined;

    if (suggestion.startsWith("https")) {
      data = await getOgData(suggestion);
      link = suggestion;
    }

    const newWish: Wish = {
      owner: uid ?? "",
      deleted: false,
      description: data?.description || "",
      id: "",
      image: data?.image || "",
      isSuggestion: true,
      name: data?.title || suggestion,
      link: link || "",
      suggestedBy: myUid,
      date: firebase.firestore.Timestamp.now(),
    };

    const docRef = await firebase.firestore().collection("wish").add(newWish);
    await docRef.update({
      id: docRef.id,
    });

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: true,
        suggestedBy: myUid,
        user: uid ?? "",
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    setFeedback(`La til forslag ${suggestion}`);
    setSuggestion("");
    mutate(["wish", uid]);

    setTimeout(() => {
      setFeedback("");
    }, 3000);
  }

  const ownWishes = wishes?.filter((m) => !m.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  const suggestions = wishes?.filter((m) => m.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });

  return (
    <Container>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <StyledBigHeader>{`Ønskelisten til ${user?.name}`}</StyledBigHeader>
      {ownWishes?.length === 0 && <p>Ingen ønsker enda.</p>}
      {ownWishes?.map((wish) => (
        <OtherWish
          myUid={myUid}
          key={wish.id}
          user={uid ?? ""}
          wishInfo={wish}
        />
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
        <EmptyButton type="submit" name="check">
          <IconWrapper>
            <Check size={24} />
          </IconWrapper>
        </EmptyButton>
      </StyledWrapper>

      <Spacer />

      <StyledBigHeader>Forslag for {user?.name}</StyledBigHeader>
      {suggestions?.map((wish) => (
        <OtherWish
          myUid={myUid}
          key={wish.id}
          user={uid ?? ""}
          wishInfo={wish}
        />
      ))}
      <Spacer />
    </Container>
  );
};
