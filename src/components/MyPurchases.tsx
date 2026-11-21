import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { usePurchase } from "../hooks/usePurchase";
import { useUser } from "../hooks/useUser";
import { useWish } from "../hooks/useWish";
import { Purchase as PurchaseType } from "../types/types";
import { Container } from "./common/Container";
import Loading from "./common/Loading";
import firebase from "./firebase/firebase";
import { EmptyState, PageHeader, WishThumb } from "./common/Page";
import { displayWishName, formatPrice } from "../util/format";
import { cn } from "../util/cn";

interface Props {
  uid: string;
}

const PurchaseInfo = ({ purchase }: { purchase: PurchaseType }) => {
  const { user } = useUser(purchase.wishOwner || "");
  const { wish } = useWish(purchase.wishOwner || "", purchase.wishId || "");

  if (!wish) return null;

  const meta = [
    `Til ${user?.name ?? "ukjent"}`,
    formatPrice(wish.price),
    purchase.date
      ? format(purchase.date.toDate(), "d. MMM yyyy", { locale: nb })
      : "",
  ].filter(Boolean);

  return (
    <li className="flex items-center gap-8 rounded-[12px] bg-primary p-8 pr-8">
      <RouterLink
        className="flex min-w-0 flex-1 items-center gap-12 text-text no-underline hover:opacity-80"
        to={`/other/${user?.uid}/${wish.id}`}
      >
        <WishThumb src={wish.image} />
        <span className="flex min-w-0 flex-col">
          <span className="line-clamp-2 font-semibold wrap-break-word">
            {displayWishName(wish.name)}
            {wish.archived && (
              <span
                className={cn(
                  "ml-8 inline-block rounded-full px-8 py-1 align-middle text-[1.1rem] font-semibold",
                  wish.received
                    ? "bg-secondary text-text"
                    : "bg-primary-dark opacity-80",
                )}
              >
                {wish.received ? "Mottatt" : "Fjernet fra listen"}
              </span>
            )}
          </span>
          <span className="truncate text-[1.3rem] opacity-70">
            {meta.join(" · ")}
          </span>
        </span>
      </RouterLink>
      {wish.link && (
        <a
          className="flex h-36 w-36 shrink-0 items-center justify-center text-text opacity-60 hover:opacity-100"
          target="_blank"
          rel="noreferrer"
          href={wish.link}
          aria-label="Åpne i nettbutikk"
          title="Åpne i nettbutikk"
        >
          <ExternalLink size={20} />
        </a>
      )}
    </li>
  );
};

const Purchase = ({ purchaseId }: { purchaseId: string }) => {
  const { purchase } = usePurchase(purchaseId);

  return purchase?.wishOwner ? <PurchaseInfo purchase={purchase} /> : null;
};

export const MyPurchases = ({ uid }: Props) => {
  const [purchases, setPurchases] = useState<string[]>();

  useEffect(() => {
    firebase
      .firestore()
      .collection("purchase")
      .where("checkedBy", "==", uid)
      .where("checked", "==", true)
      .get()
      .then((snapshot) => {
        setPurchases(snapshot.docs.map((doc) => doc.id));
      });
  }, [uid]);

  return (
    <Container>
      <PageHeader
        back={{ to: "/profile", label: "Profil" }}
        title="Mine kjøp"
        subtitle="Gaver du har merket som kjøpt. Bare du ser denne listen."
      />
      {purchases === undefined ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : purchases.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={32} />}
          title="Du har ikke kjøpt noe ennå"
        >
          Trykk «Kjøp» på et ønske hos noen andre, så havner det her.
        </EmptyState>
      ) : (
        <ul className="flex list-none flex-col gap-8">
          {purchases.map((id) => (
            <Purchase key={id} purchaseId={id} />
          ))}
        </ul>
      )}
    </Container>
  );
};
