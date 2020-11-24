import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { usePurchase } from "../hooks/usePurchase";
import { useUser } from "../hooks/useUser";
import { useWish } from "../hooks/useWish";
import { Purchase as PurchaseType } from "../types/types";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import { ALink } from "./common/Link";
import firebase from "./firebase/firebase";
import { Link } from "./yours/Wish";

interface Props {
  uid: string;
}

const PurchaseInfo = ({ purchase }: { purchase: PurchaseType }) => {
  const { user } = useUser(purchase.wishOwner || "");
  const { wish } = useWish(purchase.wishOwner || "", purchase.wishId || "");

  return (
    <div>
      {format(purchase?.date?.toDate() || new Date(), "dd.MM.yyyy")}:{" "}
      {user?.name}:{" "}
      <Link to={`/other/${user?.uid}/${wish?.id}`}>{wish?.name}</Link>
      {wish?.link && (
        <ALink style={{ marginLeft: "1rem" }} href={wish.link}>
          Link
        </ALink>
      )}
    </div>
  );
};

const Purchase = ({ purchaseId }: { purchaseId: string }) => {
  const [wishId, setWishId] = useState<string>("");
  const { purchase } = usePurchase(purchaseId);

  return (
    <div>{purchase?.wishOwner && <PurchaseInfo purchase={purchase} />}</div>
  );
};

export const MyPurchases = ({ uid }: Props) => {
  const [purchases, setPurchases] = useState<string[]>([]);

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
      {purchases.map((id) => (
        <Purchase purchaseId={id} />
      ))}
    </Container>
  );
};
