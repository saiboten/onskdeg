import React, { useEffect } from "react";
import { Container } from "../common/Container";
import { User, Wish } from "../../types/types";
import styled from "styled-components";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { Detail } from "./Detail";
import { StyledLabel } from "../common/Label";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import { mutate } from "swr";
import { useWishes } from "../../hooks/useWishes";
import { ALink } from "../common/Link";
import { format } from "date-fns";
import { StyledBigHeader } from "../common/StyledHeading";
import { useQuestions } from "../../hooks/useQuestions";
import { ListMyQuestions } from "./ListMyQuestions";

const StyledWrapper = styled.div`
  text-align: left;
  padding: 0 10px;
`;

const StyledTitle = styled.div`
  font-size: 24px;
`;

const StyledDescription = styled.div`
  font-size: 16px;
`;

const StyledLink = styled.div`
  font-size: 16px;
`;

const StyledImage = styled.img`
  max-width: 40rem;
  width: 100%;
`;

interface Params {
  wishid: string;
  uid: string;
}

export function YourWishDetails() {
  const { wishid, uid } = useParams<Params>();

  const { user } = useUser(uid);

  const { wish } = useWish(user?.uid || "?", wishid);
  const { user: suggestedByUser } = useUser(wish?.suggestedBy || "");
  const { questions } = useQuestions(wishid);

  function storeWishDetails(updatedWish: Wish) {
    firebase
      .firestore()
      .collection("wish")
      .doc(updatedWish.id)
      .update({
        ...updatedWish,
      });
  }

  if (wish == null) {
    return <Loading />;
  }

  const { name, description: wishDescription, link, price, date } = wish;

  const storeData = (
    field: string,
    newData: string | number,
    toggle: (hm: boolean) => void
  ) => {
    storeWishDetails({
      ...wish,
      [field]: newData,
    });
    toggle(false);
    mutate(["wish", uid]);
  };

  return (
    <Container>
      <StyledWrapper>
        <StyledTitle>
          <Detail fieldName="name" storeData={storeData} initialValue={name}>
            <StyledBigHeader>{name}</StyledBigHeader>
          </Detail>
        </StyledTitle>

        {wish.image && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledImage src={wish.image} />
          </div>
        )}

        {wish.isSuggestion && <p>Foreslått av: {suggestedByUser?.name}</p>}

        {!wish.isSuggestion && (
          <ListMyQuestions wishId={wishid} myUid={uid} questions={questions} />
        )}

        {date && (
          <StyledDescription>
            <StyledLabel>Lagt inn</StyledLabel>
            <p>{format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}</p>
          </StyledDescription>
        )}
        <StyledDescription>
          <StyledLabel>Beskrivelse</StyledLabel>
          <Detail
            fieldName="description"
            storeData={storeData}
            initialValue={wishDescription}
          >
            <p>{wishDescription}</p>
          </Detail>
        </StyledDescription>
        <StyledLink>
          <StyledLabel>Link</StyledLabel>
          <Detail fieldName="link" storeData={storeData} initialValue={link}>
            <ALink target="_blank" href={link}>
              {link}
            </ALink>
          </Detail>
        </StyledLink>
        <StyledLink>
          <StyledLabel>Pris</StyledLabel>
          <Detail
            fieldName="price"
            storeData={storeData}
            initialValue={price || 0}
          >
            <div>{price}</div>
          </Detail>
        </StyledLink>
      </StyledWrapper>
    </Container>
  );
}
