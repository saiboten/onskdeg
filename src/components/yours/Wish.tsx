import { ComponentProps, useState } from "react";
import { Wish as WishType } from "../../types/types";
import ListRow, { LeftSection } from "../common/ListRow";
import { IconButton } from "../common/Button";
import { Link as RouterLink } from "react-router-dom";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Star, Trash2, X, Check } from "lucide-react";

import { StyledLink, StyledLinkIcon } from "../common/StyledLink";
import { cn } from "../../util/cn";

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof RouterLink>) => (
  <RouterLink
    className={cn(
      "flex min-w-0 items-center gap-5 py-10 text-text no-underline wrap-break-word hover:opacity-75",
      className
    )}
    {...props}
  />
);


interface P {
  user: string;
  wish: WishType;
  delete: (wishId: string) => void;
}

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

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    await firebase
      .firestore()
      .collection("wish")
      .doc(wish.id)
      .update({ favorite: !wish.favorite });

    invalidate(["wish", user]);
  }

  const deleteWish = confirm ? (
    <div className="flex shrink-0 gap-6">
      <IconButton
        className="bg-contrast text-white"
        aria-label="Avbryt"
        onClick={cancel}
      >
        <X size={22} />
      </IconButton>
      <IconButton
        className="bg-negative text-white"
        aria-label="Bekreft sletting"
        onClick={deleteConfirmed}
      >
        <Check size={22} />
      </IconButton>
    </div>
  ) : (
    <div className="flex shrink-0 items-center gap-4">
      <IconButton aria-label="Favoritt" onClick={toggleFavorite}>
        <Star
          size={24}
          fill={wish.favorite ? "#FFD700" : "none"}
          color={wish.favorite ? "#FFD700" : "currentColor"}
        />
      </IconButton>
      {wish.link && (
        <StyledLink href={wish.link} target="_blank" aria-label="Åpne lenke">
          <StyledLinkIcon />
        </StyledLink>
      )}
      <IconButton aria-label="Slett" onClick={deleteItem}>
        <Trash2 size={24} />
      </IconButton>
    </div>
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
