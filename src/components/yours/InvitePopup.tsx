import { useState } from "react";
import { invalidate } from "../../queryClient";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { BorderButton, Button } from "../common/Button";
import Loading from "../common/Loading";
import { StyledBigHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";

interface Props {
  invites: string[];
  uid: string;
  firebaseUser?: firebase.User;
}

export const InvitePopup = ({ invites, uid, firebaseUser }: Props) => {
  const firstInvite = invites[0];

  const { kohort } = useKohort(firstInvite);
  const { user } = useUser(uid);
  const [loading, setLoading] = useState(false);

  async function joinGroup() {
    setLoading(true);
    // Remove invite
    await firebase
      .firestore()
      .collection("invites")
      .doc(firebaseUser?.email || "")
      .update({
        myInvites: invites.filter((m) => m !== firstInvite),
      });

    const newSet = new Set<string>();

    [...(kohort?.members ?? []), ...(user?.childs ?? []), uid];

    kohort?.members.forEach((m) => newSet.add(m));
    user?.childs?.forEach((m) => newSet.add(m));
    newSet.add(uid);

    const groupRef = firebase.firestore().collection("groups").doc(firstInvite);

    const groupData = await groupRef.get();

    // Join group in group collection
    await groupRef.update({
      members: Array.from(newSet),
      invites:
        groupData
          .data()
          ?.invites.filter((m: string) => m !== firebaseUser?.email) ?? [],
    });

    // Add group to user
    await firebase
      .firestore()
      .collection("user")
      .doc(user?.uid)
      .update({
        groups: [...(user?.groups ?? []), firstInvite],
      });

    user?.childs?.forEach(async (child) => {
      const childInfo = await firebase
        .firestore()
        .collection("user")
        .doc(child)
        .get();

      if (childInfo.data()?.groups.includes(firstInvite)) {
        // child already in group
      } else {
        firebase
          .firestore()
          .collection("user")
          .doc(child)
          .update({
            groups: [...(childInfo.data()?.groups ?? []), firstInvite],
          });
      }

      setLoading(false);
    });

    invalidate(["invites", firebaseUser?.email]);
  }

  async function declineGroupInvite() {
    setLoading(true);
    // todo decline
    await firebase
      .firestore()
      .collection("invites")
      .doc(firebaseUser?.email || "")
      .update({
        myInvites: invites.filter((m) => m !== firstInvite),
      });
    invalidate(["invites", firebaseUser?.email]);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-[rgba(0,0,0,0.4)] p-16 backdrop-blur-[10px]">
      <div
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-560 flex-col gap-12 rounded-[16px] border-2 border-solid border-secondary bg-primary-dark px-24 py-32 text-center text-text shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <StyledBigHeader className="mb-8">
          Du er invitert til en gruppe med navn:{" "}
          <strong>{kohort?.groupName}</strong>
        </StyledBigHeader>

        <p>
          Hvis du takker nei til invitasjonen må du få en ny invitasjon av
          eieren av gruppen.
        </p>

        <p className="font-semibold">Vil du være med?</p>
        <div className="mt-12 flex justify-center gap-12">
          {loading ? (
            <Loading />
          ) : (
            <>
              <BorderButton className="min-w-100" onClick={declineGroupInvite}>
                Niks
              </BorderButton>
              <Button className="min-w-100" onClick={joinGroup}>
                Bli med
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
