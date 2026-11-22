import { cn } from "../../util/cn";
import { useState } from "react";
import firebase from "../firebase/firebase";
import {
  Trash2,
  ShoppingCart,
  X,
  Check,
  ExternalLink,
  Star,
} from "lucide-react";
import { Wish, Purchase } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { usePurchase } from "../../hooks/usePurchase";
import { invalidate } from "../../queryClient";
import { StyledNotification } from "../common/StyledNotification";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { WishThumb } from "../common/Page";
import { deleteWish } from "../../services/wishArchive";
import { displayUrl, displayWishName, formatPrice } from "../../util/format";
import { useSettings } from "../../hooks/useSettings";
import { IconButton } from "../common/Button";

/** Flips the purchase state of a wish. Resolves to true if it is now bought. */
export async function togglePurchase(
  wishId: string,
  wishOwner: string,
  myUid: string,
): Promise<boolean> {
  const purchaseRef = firebase.firestore().collection("purchase").doc(wishId);
  const purchaseData = await purchaseRef.get();
  const isChecked = purchaseData.exists && purchaseData.data()?.checked;

  const newPurchase: Purchase = {
    checked: !isChecked,
    checkedBy: myUid,
    date: firebase.firestore.Timestamp.now(),
    wishId,
    wishOwner,
  };
  await purchaseRef.set(newPurchase);
  invalidate(["purchase", wishId]);
  return !isChecked;
}

interface P {
  wishInfo: Wish;
  user: string;
  myUid: string;
}

const OtherWish = ({ wishInfo, user, myUid }: P) => {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState("");
  const { purchase } = usePurchase(wishInfo?.id);
  const [confirm, setConfirm] = useState(false);
  const { settings } = useSettings(myUid);

  const isTaken = purchase?.checked ?? false;

  async function handleBuyItem(e: React.MouseEvent) {
    e.stopPropagation();
    const bought = await togglePurchase(wishInfo.id, user, myUid);
    setFeedback(
      bought
        ? `Merket «${displayWishName(wishInfo.name)}» som kjøpt`
        : `Angret kjøp av «${displayWishName(wishInfo.name)}»`,
    );

    setTimeout(() => {
      setFeedback("");
    }, 3000);

    invalidate(["purchase", wishInfo.id]);
  }

  async function handleDeleteItem() {
    await deleteWish(wishInfo.id, user);
  }

  const wishSuggestedByMe = wishInfo.suggestedBy === myUid;

  if (settings?.hideGifts && purchase?.checked) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/${wishSuggestedByMe ? "wish" : "other"}/${user}/${wishInfo.id}`);
  };

  const meta = [
    formatPrice(wishInfo.price),
    wishInfo.link ? displayUrl(wishInfo.link) : "",
    wishInfo.date
      ? format(wishInfo.date.toDate(), "d. MMM yyyy", { locale: nb })
      : "",
  ].filter(Boolean);

  return (
    <li
      onClick={handleCardClick}
      className={cn(
        "flex cursor-pointer gap-12 rounded-[12px] bg-primary p-12 text-left text-text transition-colors hover:bg-secondary-dark",
        isTaken && "opacity-60",
      )}
    >
      <StyledNotification active={feedback !== ""} text={feedback} />
      <WishThumb
        src={wishInfo.image}
        className="h-72 w-72 max-[450px]:h-56 max-[450px]:w-56"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h3
          className={cn(
            "flex items-start gap-6 text-[1.7rem] leading-[1.3] font-semibold wrap-break-word",
            isTaken && "line-through",
          )}
        >
          {wishInfo.favorite && (
            <Star
              size={16}
              fill="#FFD700"
              color="#FFD700"
              className="mt-3 shrink-0"
              aria-label="Favoritt"
            />
          )}
          <span className="line-clamp-2">{displayWishName(wishInfo.name)}</span>
        </h3>

        {wishInfo.description && (
          <p className="line-clamp-2 text-[1.4rem] leading-[1.5] opacity-80">
            {wishInfo.description}
          </p>
        )}

        <div
          className="mt-auto flex flex-wrap items-center justify-between gap-x-12 gap-y-6 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[1.3rem] opacity-70">{meta.join(" · ")}</span>

          <div className="ml-auto flex items-center gap-4">
            {wishInfo.link && (
              <a
                href={wishInfo.link}
                target="_blank"
                rel="noreferrer"
                aria-label="Åpne i nettbutikk"
                title="Åpne i nettbutikk"
                className="flex h-36 w-36 items-center justify-center text-text opacity-70 transition-opacity hover:opacity-100"
              >
                <ExternalLink size={20} />
              </a>
            )}

            {wishSuggestedByMe &&
              (confirm ? (
                <>
                  <IconButton
                    className="bg-primary-dark"
                    aria-label="Avbryt"
                    onClick={() => setConfirm(false)}
                  >
                    <X size={20} />
                  </IconButton>
                  <IconButton
                    className="bg-negative text-white"
                    aria-label="Bekreft fjerning"
                    onClick={handleDeleteItem}
                  >
                    <Check size={20} />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  aria-label="Fjern forslag"
                  title="Fjern forslag"
                  className="opacity-70 hover:opacity-100"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 size={20} />
                </IconButton>
              ))}

            <button
              type="button"
              onClick={handleBuyItem}
              title={isTaken ? "Angre kjøp" : "Marker som kjøpt"}
              className={cn(
                "inline-flex h-36 cursor-pointer items-center gap-6 rounded-full border-2 border-solid px-14 font-sans text-[1.4rem] font-semibold transition-colors",
                isTaken
                  ? "border-transparent bg-negative text-white"
                  : "border-secondary bg-transparent text-text hover:bg-secondary",
              )}
            >
              {isTaken ? <Check size={16} /> : <ShoppingCart size={16} />}
              {isTaken ? "Kjøpt" : "Kjøp"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default OtherWish;
