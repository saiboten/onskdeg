import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { Wish as WishType } from "../../types/types";
import ListRow, { LeftSection } from "../common/ListRow";
import {
  NeutralIconButton,
  NegativeIconButton,
  StyledActionButtons,
  StyledActionButtonsAnimated,
} from "../common/IconButton";
import { Link as RouterLink } from "react-router-dom";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import { Star, Trash2 } from "lucide-react";

import { StyledLink, StyledLinkIcon } from "../common/StyledLink";

export const Link = styled(RouterLink)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: grey;
  }
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${(props) => props.theme.text};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
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

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    await firebase
      .firestore()
      .collection("wish")
      .doc(wish.id)
      .update({ favorite: !wish.favorite });
    
    mutate(["wish", user]);
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
      <IconButton type="button" onClick={toggleFavorite}>
        <Star
          size={24}
          fill={wish.favorite ? "#FFD700" : "none"}
          color={wish.favorite ? "#FFD700" : theme.text}
        />
      </IconButton>
      {wish.link && (
        <StyledLink href={wish.link} target="_blank">
          <StyledLinkIcon />
        </StyledLink>
      )}
      <IconButton type="button" onClick={deleteItem}>
        <Trash2 size={24} color={theme.text} />
      </IconButton>
    </StyledActionButtons>
  );

  return (
    <ListRow>
      <LeftSection>
        <Link to={`/wish/${user}/${wish.id}`}>
          {wish.name}
        </Link>
      </LeftSection>
      {deleteWish}
    </ListRow>
  );
};
