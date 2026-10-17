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

interface P {
  wishInfo: Wish;
  user: string;
  myUid: string;
}

const confirmButton =
  "flex cursor-pointer items-center justify-center rounded-[4px] border-none p-7.5 text-white transition-transform duration-200 ease-[ease] hover:scale-110";

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
          "relative mb-16 cursor-pointer rounded-[8px] border-2 border-solid border-secondary bg-primary p-16 transition-[transform,box-shadow] duration-200 ease-[ease] hover:-translate-y-2 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]",
          isTaken ? "opacity-70" : "opacity-100"
        )}
      >
        {isTaken && (
          <div className="absolute top-10 right-10 z-1 rounded-[4px] bg-negative px-10 py-5 text-[1.2rem] font-semibold text-text">
            Kjøpt
          </div>
        )}

        <div className="mb-10 flex items-start justify-between">
          <h3
            className={cn(
              "m-0 flex items-center gap-5 text-[1.8rem] text-text",
              isTaken ? "line-through" : "no-underline"
            )}
          >
            {wishInfo.favorite && (
              <span className="text-[1.8rem] text-[#FFD700]">★</span>
            )}
            {wishInfo.name}
          </h3>
          {wishInfo.date && (
            <div className="ml-10 text-[1.2rem] whitespace-nowrap text-text">
              {format(wishInfo.date.toDate(), "dd.MM.yyyy")}
            </div>
          )}
        </div>

        {wishInfo.price && (
          <div className="mb-10 text-[1.6rem] font-semibold text-secondary">
            Kr {wishInfo.price},-
          </div>
        )}

        <div className="relative mb-10 w-full">
          {wishInfo.image ? (
            <img
              className="h-auto w-full rounded-[4px] object-cover"
              src={wishInfo.image}
              alt={wishInfo.name}
            />
          ) : (
            <div className="flex h-200 w-full items-center justify-center rounded-[4px] bg-primary text-[1.4rem] text-text">
              Ingen bilde
            </div>
          )}
        </div>

        {wishInfo.description && (
          <p className="mb-10 text-[1.4rem] leading-[1.6] wrap-break-word text-text">
            {wishInfo.description}
          </p>
        )}

        <div
          className="mt-10 flex items-center justify-end gap-10 [border-top:1px_solid_var(--color-secondary)] pt-10"
          onClick={(e) => e.stopPropagation()}
        >
          {wishInfo.link && (
            <StyledLink href={wishInfo.link} target="_blank">
              <StyledLinkIcon />
            </StyledLink>
          )}

          {confirm ? (
            <div className="flex gap-5">
              <button
                className={cn(confirmButton, "bg-contrast")}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm(false);
                }}
              >
                <X size={24} />
              </button>
              <button
                className={cn(confirmButton, "bg-negative")}
                type="button"
                onClick={handleDeleteItem}
              >
                <Check size={24} />
              </button>
            </div>
          ) : (
            wishSuggestedByMe && (
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm(true);
                }}
              >
                <Trash2 size={24} className="text-text" />
              </button>
            )
          )}

          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
            type="button"
            onClick={handleBuyItem}
          >
            <ShoppingCart size={24} className="text-text" />
          </button>
        </div>
      </div>
    </>
  );
};

export default OtherWish;
