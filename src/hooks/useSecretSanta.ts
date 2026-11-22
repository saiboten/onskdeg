import { useSuspenseQuery } from "@tanstack/react-query";
import firebase from "../components/firebase/firebase";
import { isActive } from "../services/secretSanta";
import { SecretSanta, SecretSantaAssignment } from "../types/types";

async function fetchDraw(groupId: string): Promise<SecretSanta | null> {
  if (!groupId) return null;
  const doc = await firebase
    .firestore()
    .collection("secretSanta")
    .doc(groupId)
    .get();
  const draw = doc.data() as SecretSanta | undefined;
  return draw && isActive(draw) ? draw : null;
}

/** The group's active Secret Santa draw, if any. */
export function useSecretSanta(groupId: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["secretSanta", "group", groupId],
    queryFn: () => fetchDraw(groupId),
  });
  return { draw: data ?? undefined };
}

async function fetchMine(uid: string): Promise<SecretSantaAssignment[]> {
  if (!uid) return [];
  const snapshot = await firebase
    .firestore()
    .collection("secretSantaAssignment")
    .where("giver", "==", uid)
    .get();
  return snapshot.docs
    .map((doc) => doc.data() as SecretSantaAssignment)
    .filter(isActive);
}

/** Active assignments where this user is the Secret Santa (one per group). */
export function useMySecretSantas(uid: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["secretSanta", "giver", uid],
    queryFn: () => fetchMine(uid),
  });
  return { assignments: data };
}
