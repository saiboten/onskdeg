import Loading from "../common/Loading";
import { StyledLabel } from "../common/Label";
import { Container } from "../common/Container";
import { ALink } from "../common/Link";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { usePurchase } from "../../hooks/usePurchase";
import { format } from "date-fns";
import { StyledBigHeader } from "../common/StyledHeading";
import { Spacer } from "../common/Spacer";
import { useQuestions } from "../../hooks/useQuestions";
import { AddQuestion } from "./AddQuestion";
import { ListQuestions } from "./ListQuestions";
import { useState, useRef } from "react";

interface Params {
  uid: string;
  wishid: string;
  [id: string]: string | undefined;
}

export function OtherWishDetail({ myUid }: { myUid: string }) {
  const { uid, wishid } = useParams<Params>();
  const { wish } = useWish(uid ?? "", wishid ?? "");
  const { purchase } = usePurchase(wishid ?? "");
  const { questions } = useQuestions(wishid ?? "");
  const [showPurchaser, setShowPurchaser] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { user: purchaseUser } = useUser(purchase?.checkedBy || "");

  const handleRevealClick = () => {
    dialogRef.current?.showModal();
  };

  const handleConfirm = () => {
    setShowPurchaser(true);
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  if (!wish) {
    return <Loading />;
  }

  return (
    <Container textLeft>
      <StyledBigHeader>{wish.name}</StyledBigHeader>
      <ALink
        target="_blank"
        href={`https://www.google.com/search?q=${wish.name}`}
      >
        Søk etter dette på Google
      </ALink>

      <Spacer />

      {wish.image && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img className="w-full max-w-400" src={wish.image} />
        </div>
      )}

      {wish.date && (
        <div className="text-[16px]">
          <StyledLabel>Lagt inn</StyledLabel>
          <p>{format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}</p>
        </div>
      )}

      {wish.description !== "" && (
        <>
          <StyledLabel>Beskrivelse</StyledLabel>
          <div>{wish.description}</div>
        </>
      )}

      {wish.link !== "" && (
        <>
          <StyledLabel>Link</StyledLabel>
          <div>
            <ALink href={wish.link}>{wish.name}</ALink>
          </div>
        </>
      )}
      {wish.price !== undefined && (
        <>
          <StyledLabel>Pris</StyledLabel>
          <div>{wish.price}</div>
        </>
      )}

      {purchase?.checked && (
        <>
          {showPurchaser ? (
            <div>Dette ble kjøpt av {purchaseUser?.name}</div>
          ) : (
            <>
              <div>Dette ønsket er kjøpt av noen</div>
              <button
                className="cursor-pointer rounded-[4px] border-2 border-solid border-secondary bg-secondary px-16 py-8 text-[1.4rem] text-text transition-[transform,box-shadow] duration-200 ease-[ease] hover:-translate-y-2 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
                onClick={handleRevealClick}
              >
                Vis hvem som kjøpte dette
              </button>
            </>
          )}

          <dialog
            className="max-w-500 rounded-[8px] border-2 border-solid border-secondary bg-primary p-20 text-text backdrop:bg-[rgba(0,0,0,0.7)]"
            ref={dialogRef}
          >
            <div className="flex flex-col gap-15">
              <h3>Bekreft visning</h3>
              <p>
                Er du sikker på at du vil se hvem som har kjøpt dette ønsket?
                Dette kan ødelegge overraskelsen!
              </p>
              <div className="flex justify-end gap-10">
                <button
                  className="cursor-pointer rounded-[4px] border-none px-16 py-8 text-[1.4rem] text-text transition-transform duration-200 ease-[ease] hover:-translate-y-2 bg-contrast"
                  onClick={handleCancel}
                >
                  Avbryt
                </button>
                <button
                  className="cursor-pointer rounded-[4px] border-none px-16 py-8 text-[1.4rem] text-text transition-transform duration-200 ease-[ease] hover:-translate-y-2 bg-secondary"
                  onClick={handleConfirm}
                >
                  Ja, vis hvem
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}

      <Spacer />

      {!wish.isSuggestion && (
        <>
          <ListQuestions
            wishId={wishid ?? ""}
            myUid={myUid}
            questions={questions}
          />
          <AddQuestion
            myUid={myUid}
            wishOwnerUid={uid ?? ""}
            wishId={wishid ?? ""}
          />
        </>
      )}
    </Container>
  );
}
