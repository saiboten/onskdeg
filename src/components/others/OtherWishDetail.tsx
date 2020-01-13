import React, { useEffect } from "react";
import { ApplicationState } from "../../state/reducers";
import { loadFriends } from "../../state/actions/friends";
import { useSelector, useDispatch } from "react-redux";
import { Wish, Purchase, Purchases } from "../../types/types";
import Loading from "../common/Loading";
import { setPurchasesForUser } from "../../state/actions/purchase";
import { setWishesForUser } from "../../state/actions/wish";
import firebase from "../firebase/firebase";
import { StyledLabel } from "../common/Label";
import styled from "styled-components";
import Container from "../common/Container";
import { NavLink } from "../common/Link";

interface OtherWishDetailProps {
  setWishes: (user: string, wishes: Wish[]) => void;
  setPurchases: (user: string, purchases: Purchase[]) => void;
  uid: string;
  match: any;
}

const StyledOtherWishDetail = styled.div`
  text-align: left;
`;

export function OtherWishDetail({
  match: {
    params: { user: uid, wishid }
  }
}: OtherWishDetailProps) {
  const dispatch = useDispatch();

  function setWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(setWishesForUser({ uid, wishes: newWishList }));
  }

  function setPurchases(uid: string, purchases: Purchases) {
    dispatch(setPurchasesForUser({ uid, purchases }));
  }

  const { wish } = useSelector(
    ({
      purchase,
      wish,
      user,
      friends: { loading, loaded, friends }
    }: ApplicationState) => {
      return {
        wish: wish.wishes[uid]
          ? wish.wishes[uid].reduce((init: Wish, next: Wish) =>
              next.id === wishid ? next : init
            )
          : { image: "", name: "", description: "", link: "" },
        purchasedetail: purchase.purchases[name]
          ? purchase.purchases[name][wishid]
          : {},
        name,
        loading,
        loaded
      };
    }
  );

  useEffect(() => {
    var wishRef = firebase.database().ref(`wishes/${uid}/wishes`);
    var purchaseRef = firebase.database().ref(`purchases/${uid}`);

    dispatch(loadFriends());

    wishRef.on("value", snapshot => {
      setWishes(uid, snapshot && snapshot.val());
    });

    purchaseRef.on("value", snapshot => {
      setPurchases(uid, snapshot && snapshot.val());
    });

    return () => {
      wishRef.off();
      purchaseRef.off();
    };
  }, []);

  if (wish === undefined) {
    return <Loading />;
  }

  return (
    <Container>
      <StyledOtherWishDetail>
        <NavLink to={`/other/${uid}`}>Tilbake til bruker</NavLink>

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
