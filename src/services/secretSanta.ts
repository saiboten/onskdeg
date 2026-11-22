import firebase from "../components/firebase/firebase";
import { invalidate } from "../queryClient";
import { SecretSanta, SecretSantaAssignment } from "../types/types";

const db = () => firebase.firestore();
const drawRef = (groupId: string) => db().collection("secretSanta").doc(groupId);
const assignmentRef = (groupId: string, giver: string) =>
  db().collection("secretSantaAssignment").doc(`${groupId}_${giver}`);

/**
 * Shuffles the participants into one circle: each gives to the next.
 * Nobody gets themselves, and with 3+ people nobody gets each other.
 * Returns a map of giver -> receiver.
 */
export function drawCircle(participants: string[]): Record<string, string> {
  const people = [...new Set(participants)];
  if (people.length < 2) {
    throw new Error("Secret Santa needs at least 2 participants");
  }
  for (let i = people.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [people[i], people[j]] = [people[j], people[i]];
  }
  const pairs: Record<string, string> = {};
  people.forEach((giver, i) => {
    pairs[giver] = people[(i + 1) % people.length];
  });
  return pairs;
}

/** End of December 24 (local time) this year, or next year if it has passed. */
export function secretSantaEndDate(now = new Date()): Date {
  const end = new Date(now.getFullYear(), 11, 24, 23, 59, 59, 999);
  if (now > end) end.setFullYear(end.getFullYear() + 1);
  return end;
}

export const isActive = (draw: { endsAt?: firebase.firestore.Timestamp }) =>
  !!draw.endsAt && draw.endsAt.toMillis() >= Date.now();

/**
 * Starts (or redoes) the Secret Santa for a group. Assignments from the
 * previous draw are removed in the same batch.
 */
export async function startSecretSanta(
  group: { id: string; groupName: string; admin: string },
  participants: string[],
) {
  const pairs = drawCircle(participants);
  const previous = (await drawRef(group.id).get()).data() as
    | SecretSanta
    | undefined;

  const endsAt = firebase.firestore.Timestamp.fromDate(secretSantaEndDate());
  const batch = db().batch();
  previous?.participants?.forEach((giver) =>
    batch.delete(assignmentRef(group.id, giver)),
  );

  const draw: SecretSanta = {
    groupId: group.id,
    groupName: group.groupName,
    admin: group.admin,
    participants: Object.keys(pairs),
    createdAt: firebase.firestore.Timestamp.now(),
    endsAt,
  };
  batch.set(drawRef(group.id), draw);
  Object.entries(pairs).forEach(([giver, receiver]) => {
    const assignment: SecretSantaAssignment = {
      groupId: group.id,
      groupName: group.groupName,
      giver,
      receiver,
      endsAt,
    };
    batch.set(assignmentRef(group.id, giver), assignment);
  });

  await batch.commit();
  await invalidate(["secretSanta"]);
}

/** Ends a group's Secret Santa and removes every assignment. */
export async function cancelSecretSanta(groupId: string) {
  const previous = (await drawRef(groupId).get()).data() as
    | SecretSanta
    | undefined;
  const batch = db().batch();
  previous?.participants?.forEach((giver) =>
    batch.delete(assignmentRef(groupId, giver)),
  );
  batch.delete(drawRef(groupId));
  await batch.commit();
  await invalidate(["secretSanta"]);
}
