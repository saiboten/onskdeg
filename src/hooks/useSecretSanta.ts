import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { isActive } from "../services/secretSanta";
import { SecretSanta, SecretSantaAssignment } from "../types/types";

/*
 * These never throw: if Firestore refuses (e.g. the security rules don't
 * cover the Secret Santa collections yet) the feature is reported as
 * unavailable instead of crashing the page through Suspense.
 */

type DrawResult = { draw: SecretSanta | null; unavailable: boolean };

async function fetchDraw(groupId: string): Promise<DrawResult> {
  if (!groupId) return { draw: null, unavailable: false };
  try {
    const doc = await firebase
      .firestore()
      .collection("secretSanta")
      .doc(groupId)
      .get();
    const draw = doc.data() as SecretSanta | undefined;
    return { draw: draw && isActive(draw) ? draw : null, unavailable: false };
  } catch (e) {
    console.warn("Could not load Secret Santa draw", groupId, e);
    return { draw: null, unavailable: true };
  }
}

/** The group's active Secret Santa draw, if any. */
export function useSecretSanta(groupId: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["secretSanta", "group", groupId],
    queryFn: () => fetchDraw(groupId),
  });
  return { draw: data.draw ?? undefined, unavailable: data.unavailable };
}

async function fetchMine(uid: string): Promise<SecretSantaAssignment[]> {
  if (!uid) return [];
  try {
    const snapshot = await firebase
      .firestore()
      .collection("secretSantaAssignment")
      .where("giver", "==", uid)
      .get();
    return snapshot.docs
      .map((doc) => doc.data() as SecretSantaAssignment)
      .filter(isActive);
  } catch (e) {
    console.warn("Could not load Secret Santa assignments", e);
    return [];
  }
}

/** Active assignments where this user is the Secret Santa (one per group). */
export function useMySecretSantas(uid: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["secretSanta", "giver", uid],
    queryFn: () => fetchMine(uid),
  });
  return { assignments: data };
}
