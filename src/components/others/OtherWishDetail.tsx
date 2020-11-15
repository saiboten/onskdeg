import React, { useEffect } from "react";
import { Wish, Purchase, Purchases, User } from "../../types/types";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { StyledLabel } from "../common/Label";
import styled from "styled-components";
import { Container } from "../common/Container";
import { NavLink } from "../common/Link";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import { usePurchase } from "../../hooks/usePurchase";
import { StyledBigHeader } from "../common/StyledHeading";

interface OtherWishDetailProps {
  setWishes: (user: string, wishes: Wish[]) => void;
  setPurchases: (user: string, purchases: Purchase[]) => void;
  user: User;
  match: any;
}

interface Params {
  uid: string;
  wishid: string;
}

export function OtherWishDetail() {
  const { uid, wishid } = useParams<Params>();
  const { user } = useUser(uid);
  const { wish } = useWish(uid, wishid);
  const { purchase } = usePurchase(wishid);

  console.log(purchase);

  const { user: purchaseUser } = useUser(purchase?.checkedBy || "");

  if (!wish) {
    return <Loading />;
  }

  return (
    <Container textLeft>
      <NavLink to={`/other/${user?.uid}`}>Tilbake til bruker</NavLink>

      <StyledBigHeader>{wish.name}</StyledBigHeader>

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
            <a href={wish.link}>Link</a>
          </div>
        </>
      )}
      {purchase?.checked && <div>Dette ble kjøpt av {purchaseUser?.name}</div>}
    </Container>
  );
}
