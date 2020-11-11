import React, { useEffect } from "react";
import { Wish, Purchase, Purchases, User } from "../../types/types";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { StyledLabel } from "../common/Label";
import styled from "styled-components";
import { Container } from "../common/Container";
import { NavLink } from "../common/Link";
import { useWish } from "../../hooks/useWish";

interface OtherWishDetailProps {
  setWishes: (user: string, wishes: Wish[]) => void;
  setPurchases: (user: string, purchases: Purchase[]) => void;
  user: User;
  match: any;
}

const StyledOtherWishDetail = styled.div`
  text-align: left;
`;

export function OtherWishDetail({
  match: {
    params: { wishid },
  },
  user,
}: OtherWishDetailProps) {
  const { wish } = useWish(user.uid, wishid);

  if (!wish) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <StyledOtherWishDetail>
        <NavLink to={`/other/${user.uid}`}>Tilbake til bruker</NavLink>

        <h1>
          {wish.image} {wish.name}
        </h1>

        {wish.description !== "" ? (
          <>
            <StyledLabel>Beskrivelse</StyledLabel>
            <div>{wish.description}</div>
          </>
        ) : null}

        {wish.link !== "" ? (
          <>
            <StyledLabel>Link</StyledLabel>
            <div>
              <a href={wish.link}>Link</a>
            </div>
          </>
        ) : null}
      </StyledOtherWishDetail>
    </Container>
  );
}
