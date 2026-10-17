import { useState } from "react";
import { mutate } from "swr";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { BorderButton } from "../common/Button";
import Loading from "../common/Loading";
import { Spacer } from "../common/Spacer";
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

    mutate(["invites", firebaseUser?.email]);
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
    mutate(["invites", firebaseUser?.email]);
    setLoading(false);
  }

  return (
    <div className="fixed top-0 left-0 z-3000 h-screen w-full backdrop-blur-[10px] transition-all duration-1000 ease-[ease]">
      <div className="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] bg-black text-white opacity-100 transition-all delay-250 duration-600 ease-[ease] max-[450px]:h-[70vh] max-[450px]:w-full">
        <Spacer />
        <StyledBigHeader>
          Du er invitert til en gruppe med navn:{" "}
          <strong>{kohort?.groupName}</strong>
        </StyledBigHeader>
        <Spacer />

        <p>
          Hvis du takker nei til invitasjonen må du få en ny invitasjon av
          eieren av gruppen.
        </p>

        <p>Her kommer en liste med de som er med fra før.</p>

        <p>Vil du være med?</p>
        <div className="absolute bottom-0 flex w-full justify-center">
          {loading ? (
            <Loading />
          ) : (
            <>
              <BorderButton
                style={{ marginRight: "1rem" }}
                onClick={declineGroupInvite}
              >
                Niks
              </BorderButton>
              <BorderButton onClick={joinGroup}>OK</BorderButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
