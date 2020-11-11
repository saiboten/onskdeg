import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Container } from "../common/Container";
import firebase from "../firebase/firebase";
import OtherWish from "./OtherWish";
import Icon from "../common/Icon";
import { User, Wish, Purchases } from "../../types/types";

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
  const [hideSelected, setHideSelected] = useState(false);
  const [feedback, setFeedback] = useState("");

  const {
    match: {
      params: { name },
    },
  } = props;

  function toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setHideSelected(!hideSelected);
  }

  function shouldDisplayWish(el: Wish, purchases: Purchases) {
    return !(purchases[el.id] && purchases[el.id].checked) || !hideSelected;
  }

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
      {/* {filteredWishes} */}
    </Container>
  );
};
