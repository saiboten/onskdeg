import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Container } from "../common/Container";
import OtherWish from "./OtherWish";
import Icon from "../common/Icon";
import { useWishes } from "../../hooks/useWishes";
import { useParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader } from "../common/StyledHeading";

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface Params {
  uid: string;
}

export const OthersWishList = ({ myUid }: { myUid: string }) => {
  const [hideSelected, setHideSelected] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { uid } = useParams<Params>();
  const { user } = useUser(uid);

  const { wishes } = useWishes(uid);

  function toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setHideSelected(!hideSelected);
  }

  return (
    <Container>
      <StyledBigHeader>{`Ønskelisten til ${user?.name}`}</StyledBigHeader>
      <ActionButtonsContainer>
        <Icon
          type="button"
          name={hideSelected ? "eye" : "eye-off"}
          onClick={toggleShowSelected}
        />
      </ActionButtonsContainer>
      <p>{feedback}</p>
      {wishes?.map((wish) => {
        return (
          <OtherWish myUid={myUid} key={wish.id} user={uid} wishInfo={wish} />
        );
      })}
    </Container>
  );
};
