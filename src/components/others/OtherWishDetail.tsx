import Loading from "../common/Loading";
import { Container } from "../common/Container";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { usePurchase } from "../../hooks/usePurchase";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  BorderButton,
  Button,
  borderButton,
  filledButton,
} from "../common/Button";
import { PageHeader, Panel, Section } from "../common/Page";
import { displayUrl, displayWishName, formatPrice } from "../../util/format";
import { cn } from "../../util/cn";
import { togglePurchase } from "./OtherWish";
import {
  Archive,
  ExternalLink,
  PartyPopper,
  Search,
  ShoppingCart,
  Undo2,
} from "lucide-react";
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
  const [buying, setBuying] = useState(false);
  const { user: owner } = useUser(uid ?? "");
  const { user: giver } = useUser(wish?.receivedFrom || "");

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

  const isTaken = !!purchase?.checked;

  async function handleBuy() {
    if (!wish) return;
    setBuying(true);
    try {
      await togglePurchase(wish.id, uid ?? "", myUid);
      setShowPurchaser(false);
    } finally {
      setBuying(false);
    }
  }

  const subtitle = [
    wish.date &&
      `Lagt inn ${format(wish.date.toDate(), "d. MMMM yyyy", { locale: nb })}`,
    wish.isSuggestion && "Forslag",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Container wide>
      <PageHeader
        className="mb-20"
        back={{
          to: `/other/${uid}`,
          label: `Ønskelisten til ${owner?.name ?? ""}`,
        }}
        title={displayWishName(wish.name)}
        subtitle={subtitle || undefined}
      />

      {wish.archived && (
        <Panel className="mb-24 flex items-center gap-12 shadow-[inset_0_0_0_2px_var(--color-secondary)]">
          <span className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-secondary">
            {wish.received ? <PartyPopper size={20} /> : <Archive size={20} />}
          </span>
          <p className="min-w-0 flex-1">
            {wish.received
              ? `${owner?.name ?? "Eieren"} har fått denne${giver?.name ? ` fra ${giver.name}` : ""}.`
              : "Dette ønsket er fjernet fra ønskelisten."}
          </p>
        </Panel>
      )}

      <div
        className={cn("grid gap-24", wish.image && "md:grid-cols-[300px_1fr]")}
      >
        {wish.image && (
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] bg-primary">
            <img
              className="h-full w-full bg-white object-contain"
              src={wish.image}
              alt={wish.name}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-24">
          <Panel className="flex flex-col gap-16">
            {!!wish.price && (
              <div className="text-[2.4rem] font-semibold">
                {formatPrice(wish.price)}
              </div>
            )}
            {wish.description && (
              <p className="whitespace-pre-line wrap-break-word">
                {wish.description}
              </p>
            )}
            <div className="flex flex-wrap gap-8">
              {wish.link ? (
                <a
                  className={filledButton}
                  target="_blank"
                  rel="noreferrer"
                  href={wish.link}
                >
                  <ExternalLink size={18} />
                  Se hos {displayUrl(wish.link)}
                </a>
              ) : (
                <a
                  className={borderButton}
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/search?q=${encodeURIComponent(wish.name)}`}
                >
                  <Search size={18} />
                  Søk på Google
                </a>
              )}
            </div>
          </Panel>

          <Panel
            className={cn(
              "flex flex-col gap-12",
              isTaken && "shadow-[inset_0_0_0_2px_var(--color-negative)]",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-12">
              <div>
                <p className="font-semibold">
                  {isTaken ? "Dette ønsket er kjøpt" : "Ikke kjøpt ennå"}
                </p>
                <p className="text-[1.4rem] opacity-70">
                  {isTaken
                    ? showPurchaser
                      ? `Kjøpt av ${purchaseUser?.name ?? "ukjent"}`
                      : "Andre i gruppen ser at det er tatt."
                    : "Marker det som kjøpt så ingen andre kjøper det samme."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleBuy}
                disabled={buying}
                className={cn(
                  "inline-flex h-40 cursor-pointer items-center gap-6 rounded-full border-2 border-solid px-16 font-sans text-[1.5rem] font-semibold transition-colors disabled:opacity-60",
                  isTaken
                    ? "border-negative bg-transparent text-text hover:bg-negative hover:text-white"
                    : "border-secondary bg-secondary text-text hover:brightness-110",
                )}
              >
                {isTaken ? <Undo2 size={18} /> : <ShoppingCart size={18} />}
                {isTaken ? "Angre kjøp" : "Marker som kjøpt"}
              </button>
            </div>
            {isTaken && !showPurchaser && (
              <button
                type="button"
                onClick={handleRevealClick}
                className="cursor-pointer self-start border-none bg-transparent p-0 font-sans text-[1.4rem] text-text underline opacity-70 hover:opacity-100"
              >
                Vis hvem som kjøpte det
              </button>
            )}
          </Panel>

          {!wish.isSuggestion && (
            <Section
              title="Spørsmål"
              description={`Lurer du på noe? ${owner?.name ?? "Eieren"} får beskjed og kan svare.`}
            >
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
            </Section>
          )}
        </div>
      </div>

      {purchase?.checked && (
        <dialog
          className="m-auto w-[calc(100%-3.2rem)] max-w-460 rounded-[16px] border-none bg-primary-dark p-24 text-text shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(0,0,0,0.6)] backdrop:backdrop-blur-[4px]"
          ref={dialogRef}
        >
          <div className="flex flex-col gap-12 text-left">
            <h2 className="text-[2rem] font-semibold">Vise hvem som kjøpte?</h2>
            <p>
              Er du sikker? Dette kan ødelegge overraskelsen hvis du ikke skal
              vite det.
            </p>
            <div className="mt-8 flex justify-end gap-10">
              <BorderButton onClick={handleCancel}>Avbryt</BorderButton>
              <Button onClick={handleConfirm}>Ja, vis</Button>
            </div>
          </div>
        </dialog>
      )}
    </Container>
  );
}
