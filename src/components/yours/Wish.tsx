import React, { useState, useEffect } from "react";
import styled from "styled-components";

import firebase from "../firebase/firebase";
import { Wish as WishType } from "../../types/types";
import ListRow, { LeftSection } from "../common/ListRow";
import { ImageWrapper } from "../common/Image";
import {
  NeutralIconButton,
  NegativeIconButton,
  GoldIconButton,
  StyledActionButtons,
  StyledActionButtonsAnimated,
} from "../common/IconButton";
import { Link as RouterLink } from "react-router-dom";

import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";
import { StyledLink, StyledLinkIcon } from "../common/StyledLink";
import colors from "../../styles/colors";

export const Link = styled(RouterLink)`
  text-decoration: none;

  &:visited,
  &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

interface P {
  user: string;
  wish: WishType;
  delete: (wishId: string) => void;
}

const StyledArrowRight = styled(ArrowRight)`
  width: 2rem;
  height: 2rem;
  fill: #fff;
  transform: translateY(4px);
  margin-left: 1rem;
`;

export const Wish = ({ wish, delete: deleteProp, user }: P) => {
  const [confirm, setConfirm] = useState(false);

  function deleteItem() {
    setConfirm(true);
  }

  function cancel() {
    setConfirm(false);
  }

  function deleteConfirmed() {
    deleteProp(wish.id);
  }

  const deleteWish = confirm ? (
    <StyledActionButtonsAnimated>
      <NeutralIconButton type="button" name="x" onClick={cancel} />
      <NegativeIconButton
        type="button"
        name="check"
        onClick={deleteConfirmed}
      />
    </StyledActionButtonsAnimated>
  ) : (
    <StyledActionButtons>
      {wish.link && (
        <StyledLink href={wish.link} target="_blank">
          <StyledLinkIcon />
        </StyledLink>
      )}
      <GoldIconButton
        color={colors.primaryLight}
        type="button"
        name="trash-2"
        onClick={deleteItem}
      />
    </StyledActionButtons>
  );

  return (
    <ListRow>
      <LeftSection>
        <Link to={`/wish/${user}/${wish.id}`}>{wish.name}</Link>
      </LeftSection>
      {deleteWish}
    </ListRow>
  );
};
