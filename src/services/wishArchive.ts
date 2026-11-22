import firebase from "../components/firebase/firebase";
import { invalidate } from "../queryClient";

const wishRef = (wishId: string) =>
  firebase.firestore().collection("wish").doc(wishId);

const del = firebase.firestore.FieldValue.delete;

/**
 * Deletes a wish for good, along with its purchase (so it also disappears
 * from the buyer's "Mine kjøp").
 */
export async function deleteWish(wishId: string, owner: string) {
  const db = firebase.firestore();
  const batch = db.batch();
  batch.delete(wishRef(wishId));
  batch.delete(db.collection("purchase").doc(wishId));
  await batch.commit();
  await Promise.all([
    invalidate(["wish", owner]),
    invalidate(["purchase", wishId]),
  ]);
}

/** Marks a wish as received (which also archives it). */
export async function markReceived(
  wishId: string,
  owner: string,
  from: string | undefined,
) {
  const now = firebase.firestore.Timestamp.now();
  await wishRef(wishId).update({
    archived: true,
    archivedAt: now,
    received: true,
    receivedAt: now,
    receivedFrom: from || del(),
  });
  await invalidate(["wish", owner]);
}

/**
 * "Jeg fikk denne!": if someone marked the wish as bought, it's marked as
 * received from them right away and this returns true. Otherwise nothing is
 * changed and it returns false, so the caller can ask who gave it.
 */
export async function markReceivedIfBought(wishId: string, owner: string) {
  const purchase = (
    await firebase.firestore().collection("purchase").doc(wishId).get()
  ).data();
  if (!purchase?.checked) return false;
  await markReceived(wishId, owner, purchase.checkedBy);
  return true;
}

/** Puts an archived or received wish back on the list. */
export async function restoreWish(wishId: string, owner: string) {
  await wishRef(wishId).update({
    archived: false,
    archivedAt: del(),
    received: false,
    receivedAt: del(),
    receivedFrom: del(),
  });
  await invalidate(["wish", owner]);
}
