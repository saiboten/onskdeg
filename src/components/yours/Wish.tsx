import { ComponentProps, useState } from "react";
import { Wish as WishType } from "../../types/types";
import { IconButton } from "../common/Button";
import { Link as RouterLink } from "react-router-dom";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Star, Trash2, X, Check, ExternalLink } from "lucide-react";
import { cn } from "../../util/cn";
import { WishThumb } from "../common/Page";
import {
  displayUrl,
  displayWishName,
  formatPrice,
  isUrl,
} from "../../util/format";

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof RouterLink>) => (
  <RouterLink
    className={cn(
      "flex min-w-0 items-center gap-5 py-10 text-text no-underline wrap-break-word hover:opacity-75",
      className,
    )}
    {...props}
  />
);

interface P {
  user: string;
  wish: WishType;
  delete: (wishId: string) => void;
}

/** Secondary line under a wish name: price · shop, or a lookup hint. */
export const WishMeta = ({ wish }: { wish: WishType }) => {
  const parts = [
    formatPrice(wish.price),
    wish.link ? displayUrl(wish.link) : "",
  ].filter(Boolean);

  // A bare URL as name means the AI lookup hasn't finished (it takes ~20s).
  const ageMs = Date.now() - (wish.date?.toMillis?.() ?? Date.now());
  if (isUrl(wish.name)) {
    return (
      <span className="text-[1.3rem] italic opacity-60">
        {ageMs < 3 * 60 * 1000
          ? "Henter info …"
          : "Mangler info – åpne ønsket for å hente"}
      </span>
    );
  }
  if (!parts.length) return null;
  return (
    <span className="truncate text-[1.3rem] opacity-70">
      {parts.join(" · ")}
    </span>
  );
};

export const Wish = ({ wish, delete: deleteProp, user }: P) => {
  const [confirm, setConfirm] = useState(false);
  const saved = !!wish.id;

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

  const content = (
    <>
      <WishThumb src={wish.image} />
      <span className="flex min-w-0 flex-col">
        <span className="line-clamp-2 font-semibold wrap-break-word">
          {displayWishName(wish.name)}
        </span>
        <WishMeta wish={wish} />
      </span>
    </>
  );

  return (
    <li
      className={cn(
        "flex items-center gap-8 rounded-[12px] bg-primary p-8 pr-8 text-text transition-colors",
        confirm && "shadow-[inset_0_0_0_2px_var(--color-negative)]",
        !saved && "opacity-60",
      )}
    >
      {saved ? (
        <RouterLink
          to={`/wish/${user}/${wish.id}`}
          className="flex min-w-0 flex-1 items-center gap-12 rounded-[8px] text-text no-underline hover:opacity-80"
        >
          {content}
        </RouterLink>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-12">
          {content}
        </span>
      )}

      {confirm ? (
        <div className="flex shrink-0 items-center gap-6">
          <span className="mr-4 hidden text-[1.3rem] sm:inline">Slette?</span>
          <IconButton
            className="bg-primary-dark"
            aria-label="Avbryt"
            onClick={() => setConfirm(false)}
          >
            <X size={20} />
          </IconButton>
          <IconButton
            className="bg-negative text-white"
            aria-label="Bekreft sletting"
            onClick={() => deleteProp(wish.id)}
          >
            <Check size={20} />
          </IconButton>
        </div>
      ) : (
        saved && (
          <div className="flex shrink-0 items-center">
            <IconButton
              aria-label={
                wish.favorite ? "Fjern favoritt" : "Marker som favoritt"
              }
              title={wish.favorite ? "Fjern favoritt" : "Marker som favoritt"}
              onClick={toggleFavorite}
            >
              <Star
                size={20}
                fill={wish.favorite ? "#FFD700" : "none"}
                color={wish.favorite ? "#FFD700" : "currentColor"}
                className={wish.favorite ? "" : "opacity-60"}
              />
            </IconButton>
            {wish.link && (
              <a
                href={wish.link}
                target="_blank"
                rel="noreferrer"
                aria-label="Åpne i nettbutikk"
                title="Åpne i nettbutikk"
                className="flex h-36 w-36 items-center justify-center text-text opacity-60 transition-opacity hover:opacity-100"
              >
                <ExternalLink size={20} />
              </a>
            )}
            <IconButton
              aria-label="Slett"
              title="Slett"
              className="opacity-60 hover:opacity-100"
              onClick={() => setConfirm(true)}
            >
              <Trash2 size={20} />
            </IconButton>
          </div>
        )
      )}
    </li>
  );
};
