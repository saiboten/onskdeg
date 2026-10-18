import { cn } from "../../util/cn";
import { useState } from "react";
import firebase from "../firebase/firebase";
import { Trash2, ShoppingCart, X, Check } from "lucide-react";
import { Wish, Purchase } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { usePurchase } from "../../hooks/usePurchase";
import { invalidate } from "../../queryClient";
import { StyledNotification } from "../common/StyledNotification";
import { format } from "date-fns";
import { StyledLink, StyledLinkIcon } from "../common/StyledLink";
import { useSettings } from "../../hooks/useSettings";
import { IconButton } from "../common/Button";

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
    const purchaseRef = firebase
      .firestore()
      .collection("purchase")
      .doc(wishInfo.id);

    const purchaseData = await purchaseRef.get();

    const isChecked = purchaseData.exists && purchaseData.data()?.checked;

    const newPurchase: Purchase = {
      checked: isChecked ? false : true,
      checkedBy: myUid,
      date: firebase.firestore.Timestamp.now(),
      wishId: wishInfo.id,
      wishOwner: user,
    };

    await purchaseRef.set(newPurchase);

    if (isChecked) {
      setFeedback(`Du solgte ${wishInfo.name}`);
    } else {
      setFeedback(`Du kjøpte ${wishInfo.name}`);
    }

    setTimeout(() => {
      setFeedback("");
    }, 3000);

    invalidate(["purchase", wishInfo.id]);
  }

  async function handleDeleteItem(e: React.MouseEvent) {
    e.stopPropagation();
    await firebase.firestore().collection("wish").doc(wishInfo.id).delete();
    invalidate(["wish", user]);
  }

  const wishSuggestedByMe = wishInfo.suggestedBy === myUid;

  if (settings?.hideGifts && purchase?.checked) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/${wishSuggestedByMe ? "wish" : "other"}/${user}/${wishInfo.id}`);
  };

  return (
    <>
      {feedback && (
        <StyledNotification active={feedback !== ""} text={feedback} />
      )}
      <div
        onClick={handleCardClick}
        className={cn(
          "mb-16 cursor-pointer rounded-[10px] border-2 border-solid border-secondary bg-primary p-16 text-left transition-[transform,box-shadow] duration-200 ease-[ease] hover:-translate-y-2 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]",
          isTaken ? "opacity-70" : "opacity-100"
        )}
      >
        <div className="flex items-start justify-between gap-10">
          <h3
            className={cn(
              "m-0 flex min-w-0 items-center gap-6 text-[1.8rem] leading-[1.3] wrap-break-word text-text",
              isTaken ? "line-through" : "no-underline"
            )}
          >
            {wishInfo.favorite && (
              <span className="text-[1.8rem] text-[#FFD700]">★</span>
            )}
            {wishInfo.name}
          </h3>
          <div className="flex shrink-0 items-center gap-8 pt-2">
            {isTaken && (
              <span className="rounded-[4px] bg-negative px-8 py-2 text-[1.2rem] font-semibold text-white">
                Kjøpt
              </span>
            )}
            {wishInfo.date && (
              <span className="text-[1.2rem] whitespace-nowrap text-text opacity-75">
                {format(wishInfo.date.toDate(), "dd.MM.yyyy")}
              </span>
            )}
          </div>
        </div>

        {wishInfo.price && (
          <div className="mt-4 text-[1.6rem] font-semibold text-secondary">
            Kr {wishInfo.price},-
          </div>
        )}

        {wishInfo.image && (
          <img
            className="mx-auto mt-12 h-auto max-h-400 w-auto max-w-full rounded-[6px] object-contain"
            src={wishInfo.image}
            alt={wishInfo.name}
          />
        )}

        {wishInfo.description && (
          <p className="mt-10 text-[1.4rem] leading-[1.6] wrap-break-word text-text">
            {wishInfo.description}
          </p>
        )}

        <div
          className="mt-12 flex items-center justify-end gap-6 [border-top:1px_solid_var(--color-secondary)] pt-8"
          onClick={(e) => e.stopPropagation()}
        >
          {wishInfo.link && (
            <StyledLink
              href={wishInfo.link}
              target="_blank"
              aria-label="Åpne lenke"
            >
              <StyledLinkIcon />
            </StyledLink>
          )}

          {confirm ? (
            <div className="flex gap-6">
              <IconButton
                className="bg-contrast text-white"
                aria-label="Avbryt"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm(false);
                }}
              >
                <X size={22} />
              </IconButton>
              <IconButton
                className="bg-negative text-white"
                aria-label="Bekreft sletting"
                onClick={handleDeleteItem}
              >
                <Check size={22} />
              </IconButton>
            </div>
          ) : (
            wishSuggestedByMe && (
              <IconButton
                aria-label="Slett"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm(true);
                }}
              >
                <Trash2 size={24} />
              </IconButton>
            )
          )}

          <IconButton
            aria-label={isTaken ? "Angre kjøp" : "Marker som kjøpt"}
            title={isTaken ? "Angre kjøp" : "Marker som kjøpt"}
            onClick={handleBuyItem}
          >
            <ShoppingCart size={24} />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default OtherWish;
