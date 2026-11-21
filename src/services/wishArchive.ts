import firebase from "../components/firebase/firebase";
import { invalidate } from "../queryClient";

const wishRef = (wishId: string) =>
  firebase.firestore().collection("wish").doc(wishId);

const del = firebase.firestore.FieldValue.delete;

/** Hides a wish everywhere instead of deleting it. */
export async function archiveWish(wishId: string, owner: string) {
  await wishRef(wishId).update({
    archived: true,
    archivedAt: firebase.firestore.Timestamp.now(),
  });
  await invalidate(["wish", owner]);
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
