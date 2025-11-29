import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { Wish as WishType } from "../../types/types";
import ListRow, { LeftSection } from "../common/ListRow";
import {
  NeutralIconButton,
  NegativeIconButton,
  GoldIconButton,
  StyledActionButtons,
  StyledActionButtonsAnimated,
} from "../common/IconButton";
import { Link as RouterLink } from "react-router-dom";

import { StyledLink, StyledLinkIcon } from "../common/StyledLink";

export const Link = styled(RouterLink)`
  text-decoration: none;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
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

export const Wish = ({ wish, delete: deleteProp, user }: P) => {
  const theme = useTheme();
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
        color={theme.text}
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
