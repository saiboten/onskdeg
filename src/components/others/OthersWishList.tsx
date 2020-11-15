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

interface State {
  hideSelected: boolean;
  feedback: string;
}

export const OthersWishList = () => {
  const [hideSelected, setHideSelected] = useState(false);
  const [feedback, setFeedback] = useState("");

  function toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setHideSelected(!hideSelected);
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
