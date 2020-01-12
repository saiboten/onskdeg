import React, { useEffect } from "react";
import { ApplicationState } from "../../state/reducers";
import spinnerWhileLoading from "../common/spinnerWhileLoading";
import { loadFriends } from "../../state/actions/friends";
import { connect } from "react-redux";
import { Dispatch } from "redux";
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
  wish: Wish;
  setWishes: (user: string, wishes: Wish[]) => void;
  setPurchases: (user: string, purchases: Purchase[]) => void;
  uid: string;
}

const StyledOtherWishDetail = styled.div`
  text-align: left;
`;

function OtherWishDetail({
  uid,
  wish,
  setWishes,
  setPurchases
}: OtherWishDetailProps) {
  if (wish === undefined) {
    return <Loading />;
  }

  useEffect(() => {
    var wishRef = firebase.database().ref(`wishes/${uid}/wishes`);
    var purchaseRef = firebase.database().ref(`purchases/${uid}`);

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

  return (
    <Container>
      <StyledOtherWishDetail>
        <NavLink to={`/other/${uid}`}>Tilbake til bruker</NavLink>

        <h1>
          {wish.image} {wish.name}
        </h1>

        {wish.description && wish.description !== "" ? (
          <>
            <StyledLabel>Beskrivelse</StyledLabel>
            <div>{wish.description}</div>
          </>
        ) : null}

        {wish.link && wish.link !== "" ? (
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

const mapStateToProps = (
  {
    purchase,
    wish,
    user,
    friends: { loading, loaded, friends }
  }: ApplicationState,
  {
    match: {
      params: { user: uid, wishid }
    }
  }: any
) => {
  return {
    wish: wish.wishes[uid]
      ? wish.wishes[uid].reduce((init: Wish, next: Wish) =>
          next.id === wishid ? next : init
        )
      : {},
    purchasedetail: purchase.purchases[name]
      ? purchase.purchases[name][wishid]
      : {},
    name,
    uid,
    loading,
    loaded
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: () => dispatch(loadFriends()),
  setWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(setWishesForUser({ uid, wishes: newWishList }));
  },
  setPurchases(uid: string, purchases: Purchases) {
    dispatch(setPurchasesForUser({ uid, purchases }));
  }
});

const WithSpinner = spinnerWhileLoading(
  ({
    loaded,
    loading,
    load
  }: {
    loaded: boolean;
    loading: boolean;
    load: () => void;
  }) => {
    if (!loaded && !loading) {
      load();
    }
    return !loaded;
  }
)(OtherWishDetail);

const OthersWishListWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(WithSpinner);

export default OthersWishListWrapper;
