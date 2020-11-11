import React, { useEffect } from "react";
import { Container } from "../common/Container";
import { User, Wish } from "../../types/types";
import styled from "styled-components";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import Detail from "./Detail";
import { StyledLabel } from "../common/Label";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router";
import { useUser } from "../../hooks/userUser";

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

const StyledWishComplete = styled.div``;

interface Props {
  uid: string;
}

interface Params {
  wishid: string;
}

export function YourWishDetails(props: Props) {
  const { wishid } = useParams<Params>();

  const { uid } = props;

  const { user } = useUser(uid);

  const { wish } = useWish(user?.uid || "?", wishid);

  function updateWishStore(newData: Array<Wish>) {
    // firebase.firestore().
  }

  function storeWishDetails(updatedWish: Wish) {
    // Store
  }

  if (wish == null) {
    return <Loading />;
  }

  const { name, description: wishDescription, image, link } = wish;

  const storeData = (
    field: string,
    newData: string,
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
          {image}
          <Detail fieldName="name" storeData={storeData} initialValue={name} />
        </StyledTitle>
        <StyledDescription>
          <StyledLabel>Beskrivelse</StyledLabel>
          <Detail
            fieldName="description"
            storeData={storeData}
            initialValue={wishDescription}
          />
        </StyledDescription>
        <StyledLink>
          <StyledLabel>Link</StyledLabel>
          <Detail fieldName="link" storeData={storeData} initialValue={link} />
        </StyledLink>
        {/* <StyledWishComplete>
                    <button type="text">Jeg har oppfylt ønsket</button>
                </StyledWishComplete> */}
      </StyledWrapper>
    </Container>
  );
}
