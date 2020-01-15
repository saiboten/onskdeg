import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { useSelector, useDispatch } from "react-redux";
import { Wish } from "../../types/types";
import styled from "styled-components";
import {
  setWishes,
  storeWishDetails as storeWishDetailsAction
} from "../../state/actions/wish";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import Detail from "./Detail";
import { StyledLabel } from "../common/Label";
import { ApplicationState } from "../../state/reducers";

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
  match: any;
}

export function YourWishDetails(props: Props) {
  const { wish, user } = useSelector(({ wish, user }: ApplicationState) => ({
    wish: wish.wishes[user.uid || ""]
      ? wish.wishes[user.uid || ""]
          .filter((w: Wish) => w.id === props.match.params.wishid)
          .reduce((w: Wish) => w)
      : undefined,
    user
  }));

  const dispatch = useDispatch();

  function updateWishStore(newData: Array<Wish>) {
    dispatch(setWishes(newData));
  }

  function storeWishDetails(updatedWish: Wish) {
    const {
      match: {
        params: { wishid }
      }
    } = props;
    dispatch(storeWishDetailsAction({ wishid, updatedWish }));
  }

  useEffect(() => {
    const firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

    firebaseRef.on("value", (snapshot: any) => {
      updateWishStore(snapshot.val());
    });

    return () => {
      firebaseRef.off();
    };
  }, []);

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
      [field]: newData
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
