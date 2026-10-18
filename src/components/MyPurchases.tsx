import { format } from "date-fns";
import { useEffect, useState } from "react";
import { usePurchase } from "../hooks/usePurchase";
import { useUser } from "../hooks/useUser";
import { useWish } from "../hooks/useWish";
import { Purchase as PurchaseType } from "../types/types";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import { ALink } from "./common/Link";
import firebase from "./firebase/firebase";
import { Link } from "./yours/Wish";
import ListRow, { LeftSection } from "./common/ListRow";

interface Props {
  uid: string;
}

const PurchaseInfo = ({ purchase }: { purchase: PurchaseType }) => {
  const { user } = useUser(purchase.wishOwner || "");
  const { wish } = useWish(purchase.wishOwner || "", purchase.wishId || "");

  return (
    <ListRow className="pr-16">
      <LeftSection className="flex-col items-start py-6">
        <Link
          className="py-0 font-semibold"
          to={`/other/${user?.uid}/${wish?.id}`}
        >
          {wish?.name}
        </Link>
        <span className="text-[1.3rem] opacity-75">
          Til {user?.name} ·{" "}
          {format(purchase?.date?.toDate() || new Date(), "dd.MM.yyyy")}
        </span>
      </LeftSection>
      {wish?.link && (
        <ALink className="shrink-0" target="_blank" href={wish.link}>
          Link
        </ALink>
      )}
    </ListRow>
  );
};

const Purchase = ({ purchaseId }: { purchaseId: string }) => {
  const { purchase } = usePurchase(purchaseId);

  return purchase?.wishOwner ? <PurchaseInfo purchase={purchase} /> : null;
};

export const MyPurchases = ({ uid }: Props) => {
  const [purchases, setPurchases] = useState<string[]>();

  useEffect(() => {
    const data = firebase
      .firestore()
      .collection("purchase")
      .where("checkedBy", "==", uid)
      .where("checked", "==", true);
    data.get().then((snapshot) => {
      setPurchases(snapshot.docs.map((doc) => doc.id));
    });
  }, [uid]);

  return (
    <Container textLeft>
      <StyledBigHeader>Mine kjøp</StyledBigHeader>
      {purchases?.length === 0 && <p>Du har ikke kjøpt noe enda.</p>}
      {purchases?.map((id) => (
        <Purchase key={id} purchaseId={id} />
      ))}
    </Container>
  );
};
