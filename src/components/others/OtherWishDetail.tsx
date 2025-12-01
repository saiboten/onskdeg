import Loading from "../common/Loading";
import { StyledLabel } from "../common/Label";
import styled from "styled-components";
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

const StyledImage = styled.img`
  max-width: 40rem;
  width: 100%;
`;

const StyledDescription = styled.div`
  font-size: 16px;
`;

const StyledDialog = styled.dialog`
  padding: 2rem;
  border: 2px solid ${(props) => props.theme.secondary};
  border-radius: 8px;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  max-width: 500px;

  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const DialogButton = styled.button`
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.4rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ConfirmButton = styled(DialogButton)`
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
`;

const CancelButton = styled(DialogButton)`
  background: ${(props) => props.theme.contrast};
  color: ${(props) => props.theme.text};
`;

const RevealButton = styled.button`
  padding: 0.8rem 1.6rem;
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => props.theme.secondary};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.4rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

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
          <StyledImage src={wish.image} />
        </div>
      )}

      {wish.date && (
        <StyledDescription>
          <StyledLabel>Lagt inn</StyledLabel>
          <p>{format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}</p>
        </StyledDescription>
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
              <RevealButton onClick={handleRevealClick}>
                Vis hvem som kjøpte dette
              </RevealButton>
            </>
          )}
          
          <StyledDialog ref={dialogRef}>
            <DialogContent>
              <h3>Bekreft visning</h3>
              <p>
                Er du sikker på at du vil se hvem som har kjøpt dette ønsket?
                Dette kan ødelegge overraskelsen!
              </p>
              <DialogButtons>
                <CancelButton onClick={handleCancel}>Avbryt</CancelButton>
                <ConfirmButton onClick={handleConfirm}>
                  Ja, vis hvem
                </ConfirmButton>
              </DialogButtons>
            </DialogContent>
          </StyledDialog>
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
