import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import Container from "../common/container/Container";
import firebase from "../firebase/firebase";
import OtherWish from "./OtherWish";
import {
  setWishesForUser,
  storeWishesToFirebase
} from "../../state/actions/wish";
import {
  setPurchasesForUser,
  purchaseItem as purchaseItemAction,
  sellItem as sellItemAction
} from "../../state/actions/purchase";
import Icon from "../common/Icon";
import { User, Wish, Purchases } from "../../types/types";
import { ApplicationState } from "../../state/reducers";
import { loadFriends } from "../../state/actions/friends";

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface Props {
  match: { params: { name: string } };
  setWishes: (name: string, newWishList: Array<Wish>) => void;
  setPurchases: (name: string, purchasesForUser: Purchases) => void;
  storeWishes: (name: string, newWishList: Array<Wish>) => void;
  purchaseItem: (uid: string, itemid: string) => void;
  sellItem: (uid: string, itemid: string) => void;
  user: User;
  wishes: Array<Wish>;
  friend: User;
  purchases: Purchases;
  name: string;
}
interface State {
  hideSelected: boolean;
  feedback: string;
}
export const OthersWishList = (props: Props) => {
  let wishRef: firebase.database.Reference;
  let purchaseRef: firebase.database.Reference;

  const [hideSelected, setHideSelected] = useState(false);
  const [feedback, setFeedback] = useState("");

  const {
    match: {
      params: { name }
    }
  } = props;

  const selector = useSelector(
    ({ purchase, wish, user, friends: { friends } }: ApplicationState) => {
      const friendsFiltered = friends.filter(u => u.uid === name);

      return {
        wishes: wish.wishes[name] || [],
        purchases: purchase.purchases[name] || {},
        user,
        friend: friendsFiltered.length > 0 ? friendsFiltered.reduce(e => e) : {}
      };
    }
  );

  const { wishes, friend, purchases } = selector;

  const dispatch = useDispatch();

  function setWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(setWishesForUser({ uid, wishes: newWishList }));
  }

  function setPurchases(uid: string, purchases: Purchases) {
    dispatch(setPurchasesForUser({ uid, purchases }));
  }

  function storeWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(storeWishesToFirebase(uid, newWishList));
  }

  function purchaseItem(uid: string, itemid: string) {
    dispatch(purchaseItemAction(uid, itemid));
  }

  function sellItem(uid: string, itemid: string) {
    dispatch(sellItemAction(uid, itemid));
  }

  useEffect(() => {
    const {
      match: {
        params: { name }
      }
    } = props;

    wishRef = firebase.database().ref(`wishes/${name}/wishes`);
    purchaseRef = firebase.database().ref(`purchases/${name}`);

    dispatch(loadFriends());

    wishRef.on("value", snapshot => {
      setWishes(name, snapshot && snapshot.val());
    });

    purchaseRef.on("value", snapshot => {
      setPurchases(name, snapshot && snapshot.val());
    });

    return () => {
      wishRef && wishRef.off();
    };
  }, [name]);

  function check(id: string) {
    if (purchases[id] && purchases[id].checked) {
      sellItem(name, id);
      setFeedback("Solgt!");
    } else {
      purchaseItem(name, id);
      setFeedback("Kjøpt!");
    }
  }

  function toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setHideSelected(!hideSelected);
  }

  function shouldDisplayWish(el: Wish, purchases: Purchases) {
    return !(purchases[el.id] && purchases[el.id].checked) || !hideSelected;
  }

  const filteredWishes = wishes
    .filter(el => shouldDisplayWish(el, purchases))
    .map(wishInfo => (
      <OtherWish
        deleteSuggestion={() => null}
        user={name}
        canDelete={false}
        key={wishInfo.id}
        onClick={check}
        wishInfo={wishInfo}
        purchase={
          purchases[wishInfo.id]
            ? purchases[wishInfo.id]
            : { checked: false, checkedby: "" }
        }
      />
    ));

  return (
    <Container>
      <div className="flex-row space-between">
        <h1 className="shrink overflow-hidden">{`Ønskelisten til TODO`}</h1>
      </div>
      <ActionButtonsContainer>
        <Icon
          type="button"
          name={hideSelected ? "eye" : "eye-off"}
          onClick={toggleShowSelected}
        />
      </ActionButtonsContainer>
      <p>{feedback}</p>
      {filteredWishes}
    </Container>
  );
};
