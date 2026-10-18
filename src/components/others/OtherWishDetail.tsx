import Loading from "../common/Loading";
import { StyledLabel } from "../common/Label";
import { Container } from "../common/Container";
import { ALink } from "../common/Link";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { usePurchase } from "../../hooks/usePurchase";
import { format } from "date-fns";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import { BorderButton, Button } from "../common/Button";
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
      <StyledBigHeader className="mb-4">{wish.name}</StyledBigHeader>
      <ALink
        target="_blank"
        href={`https://www.google.com/search?q=${encodeURIComponent(wish.name)}`}
      >
        Søk etter dette på Google
      </ALink>

      {wish.image && (
        <div className="mt-20 flex justify-center">
          <img
            className="w-full max-w-400 rounded-[10px]"
            src={wish.image}
            alt={wish.name}
          />
        </div>
      )}

      <div className="my-24 flex flex-col gap-16">
        {wish.date && (
          <div>
            <StyledLabel>Lagt inn</StyledLabel>
            <p>{format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}</p>
          </div>
        )}

        {wish.description && (
          <div>
            <StyledLabel>Beskrivelse</StyledLabel>
            <p className="wrap-break-word">{wish.description}</p>
          </div>
        )}

        {wish.link && (
          <div>
            <StyledLabel>Link</StyledLabel>
            <ALink target="_blank" href={wish.link}>
              {wish.name}
            </ALink>
          </div>
        )}

        {!!wish.price && (
          <div>
            <StyledLabel>Pris</StyledLabel>
            <p>Kr {wish.price},-</p>
          </div>
        )}

        {purchase?.checked && (
          <div>
            <StyledLabel>Kjøpt</StyledLabel>
            {showPurchaser ? (
              <p>Dette ble kjøpt av {purchaseUser?.name}</p>
            ) : (
              <div className="flex flex-wrap items-center gap-12">
                <p>Dette ønsket er kjøpt av noen</p>
                <BorderButton onClick={handleRevealClick}>
                  Vis hvem som kjøpte dette
                </BorderButton>
              </div>
            )}
          </div>
        )}
      </div>

      {purchase?.checked && (
        <dialog
          className="m-auto w-[calc(100%-3.2rem)] max-w-500 rounded-[12px] border-2 border-solid border-secondary bg-primary-dark p-24 text-text backdrop:bg-[rgba(0,0,0,0.7)]"
          ref={dialogRef}
        >
          <div className="flex flex-col gap-12">
            <StyledSubHeader className="mb-0 font-medium">
              Bekreft visning
            </StyledSubHeader>
            <p>
              Er du sikker på at du vil se hvem som har kjøpt dette ønsket?
              Dette kan ødelegge overraskelsen!
            </p>
            <div className="mt-8 flex justify-end gap-10">
              <BorderButton onClick={handleCancel}>Avbryt</BorderButton>
              <Button onClick={handleConfirm}>Ja, vis hvem</Button>
            </div>
          </div>
        </dialog>
      )}

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
