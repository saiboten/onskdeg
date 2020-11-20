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

interface Params {
  wishid: string;
  uid: string;
}

export function YourWishDetails() {
  const { wishid, uid } = useParams<Params>();

  const { user } = useUser(uid);

  const { wishes } = useWishes(user?.uid || "");
  const { wish } = useWish(user?.uid || "?", wishid);

  async function updateWishStore(newData: Array<Wish>) {
    await firebase
      .firestore()
      .collection("wishes")
      .doc(user?.uid || "?")
      .set({
        wishes: newData,
      })
      .then(() => {
        mutate(["wishes", user?.uid]);
      });
  }

  function storeWishDetails(updatedWish: Wish) {
    const newWishList = wishes?.map((wish) => {
      if (wish.id === updatedWish.id) {
        return updatedWish;
      }
      return wish;
    });

    if (newWishList) {
      updateWishStore(newWishList);
    }
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
  };

  return (
    <Container>
      <StyledWrapper>
        <StyledTitle>
          <Detail fieldName="name" storeData={storeData} initialValue={name}>
            <p>{name}</p>
          </Detail>
        </StyledTitle>
        {date && (
          <StyledDescription>
            <StyledLabel>Dato for innleggelse</StyledLabel>
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
