import { useEffect, useRef, useState } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { PartyPopper } from "lucide-react";
import { Wish } from "../../types/types";
import { usePurchase } from "../../hooks/usePurchase";
import { useKohorts } from "../../hooks/useKohorts";
import { userQuery } from "../../hooks/useUser";
import { markReceived } from "../../services/wishArchive";
import { BorderButton, Button } from "../common/Button";
import { StyledLabel } from "../common/Label";
import { inputStyle } from "../common/StyledInput";
import Spinner from "../common/Spinner";
import { cn } from "../../util/cn";
import { displayWishName } from "../../util/format";
import firebase from "../firebase/firebase";

interface Props {
  wish: Wish;
  owner: string;
  onClose: () => void;
  onDone?: () => void;
}

/** Asks who gave a gift, then marks the wish as received. */
export const ReceivedDialog = ({ wish, owner, onClose, onDone }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const myUid = firebase.auth().currentUser?.uid ?? "";
  const { purchase } = usePurchase(wish.id);
  const buyer = purchase?.checked ? purchase.checkedBy : undefined;

  const kohorts = useKohorts(myUid);
  const memberIds = new Set<string>();
  kohorts?.forEach((k) => k.members.forEach((m) => memberIds.add(m)));
  if (buyer) memberIds.add(buyer);
  memberIds.delete(owner);

  const people = useSuspenseQueries({
    queries: [...memberIds].map(userQuery),
  })
    .map((r) => r.data)
    .filter((u) => u.uid && u.name)
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "nb"));

  const [from, setFrom] = useState(buyer ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (buyer) setFrom(buyer);
  }, [buyer]);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  async function handleConfirm() {
    setSaving(true);
    try {
      await markReceived(wish.id, owner, from || undefined);
      onDone?.();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      className="m-auto w-[calc(100%-3.2rem)] max-w-460 rounded-[16px] border-none bg-primary-dark p-24 text-left text-text shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(0,0,0,0.6)] backdrop:backdrop-blur-[4px]"
    >
      <div className="flex flex-col gap-16">
        <div className="flex items-start gap-12">
          <span className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full bg-secondary">
            <PartyPopper size={22} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[2rem] leading-[1.3] font-semibold">
              Fikk du denne?
            </h2>
            <p className="wrap-break-word opacity-80">
              {displayWishName(wish.name)}
            </p>
          </div>
        </div>

        <div>
          <StyledLabel htmlFor="received-from">Fra hvem?</StyledLabel>
          <select
            id="received-from"
            className={cn(inputStyle, "w-full cursor-pointer")}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Vet ikke / vil ikke si</option>
            {people.map((p) => (
              <option key={p.uid} value={p.uid}>
                {p.name}
                {p.uid === buyer ? " (merket som kjøpt)" : ""}
              </option>
            ))}
          </select>
          <p className="mt-6 text-[1.3rem] opacity-70">
            Ønsket fjernes fra listen og havner under «Gaver jeg har fått».
          </p>
        </div>

        <div className="flex justify-end gap-10">
          <BorderButton type="button" onClick={onClose}>
            Avbryt
          </BorderButton>
          <Button type="button" onClick={handleConfirm} disabled={saving}>
            {saving ? <Spinner /> : "Ja, jeg fikk den!"}
          </Button>
        </div>
      </div>
    </dialog>
  );
};
