import React, { useEffect } from "react";
import { Wish, Purchase, Purchases, User } from "../../types/types";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { StyledLabel } from "../common/Label";
import styled from "styled-components";
import { Container } from "../common/Container";
import { ALink, NavLink } from "../common/Link";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import { usePurchase } from "../../hooks/usePurchase";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import { Spacer } from "../common/Spacer";
import { useQuestions } from "../../hooks/useQuestions";
import { AddQuestion } from "./AddQuestion";
import { ListQuestions } from "./ListQuestions";

const StyledImage = styled.img`
  max-width: 40rem;
  width: 100%;
`;

interface Params {
  uid: string;
  wishid: string;
}

export function OtherWishDetail({ myUid }: { myUid: string }) {
  const { uid, wishid } = useParams<Params>();
  const { user } = useUser(uid);
  const { wish } = useWish(uid, wishid);
  const { purchase } = usePurchase(wishid);
  const { questions } = useQuestions(wishid);

  const { user: purchaseUser } = useUser(purchase?.checkedBy || "");

  if (!wish) {
    return <Loading />;
  }

  return (
    <Container textLeft>
      <StyledBigHeader>{wish.name}</StyledBigHeader>
      <ALink
        target="_blank"
        href={`https://www.google.com/search?q=${wish.name}`}
      >
        Søk etter dette på Google
      </ALink>

      <Spacer />

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

      {wish.description !== "" && (
        <>
          <StyledLabel>Beskrivelse</StyledLabel>
          <div>{wish.description}</div>
        </>
      )}

      {wish.link !== "" && (
        <>
          <StyledLabel>Link</StyledLabel>
          <div>
            <ALink href={wish.link}>{wish.name}</ALink>
          </div>
        </>
      )}
      {wish.price !== undefined && (
        <>
          <StyledLabel>Pris</StyledLabel>
          <div>{wish.price}</div>
        </>
      )}
      {purchase?.checked && <div>Dette ble kjøpt av {purchaseUser?.name}</div>}
      <Spacer />
      <ListQuestions wishId={wishid} myUid={myUid} questions={questions} />
      <AddQuestion myUid={myUid} wishOwnerUid={uid} wishId={wishid} />
    </Container>
  );
}
