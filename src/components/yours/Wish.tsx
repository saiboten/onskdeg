import { ComponentProps, useState } from "react";
import { Wish as WishType } from "../../types/types";
import ListRow, { LeftSection } from "../common/ListRow";
import { StyledActionButtons } from "../common/IconButton";
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
      "flex items-center gap-5 text-text no-underline hover:text-[grey]",
      className
    )}
    {...props}
  />
);

const iconButton =
  "flex cursor-pointer items-center justify-center border-none bg-transparent p-5 text-text transition-transform duration-200 ease-[ease] hover:scale-110";

const confirmButton =
  "flex cursor-pointer items-center justify-center rounded-[4px] border-none p-7.5 text-white transition-transform duration-200 ease-[ease] hover:scale-110";

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
    <div className="flex gap-5">
      <button
        className={cn(confirmButton, "bg-contrast")}
        type="button"
        onClick={cancel}
      >
        <X size={24} />
      </button>
      <button
        className={cn(confirmButton, "bg-negative")}
        type="button"
        onClick={deleteConfirmed}
      >
        <Check size={24} />
      </button>
    </div>
  ) : (
    <StyledActionButtons>
      <button className={iconButton} type="button" onClick={toggleFavorite}>
        <Star
          size={24}
          fill={wish.favorite ? "#FFD700" : "none"}
          color={wish.favorite ? "#FFD700" : "currentColor"}
        />
      </button>
      {wish.link && (
        <StyledLink href={wish.link} target="_blank">
          <StyledLinkIcon />
        </StyledLink>
      )}
      <button className={iconButton} type="button" onClick={deleteItem}>
        <Trash2 size={24} />
      </button>
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
