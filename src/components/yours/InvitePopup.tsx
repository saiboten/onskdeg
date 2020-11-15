import React, { useState } from "react";
import styled from "styled-components";
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

const StyledBlurredBackground = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  transition: all 1s;

  @supports (-webkit-backdrop-filter: blur(10px)) or
    (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
`;

const StyledInnerContent = styled.div`
  width: 50%;
  height: 50%;
  background: #000;
  color: #fff;
  box-shadow: 0 2rem 4rem rgba(#000, 0.2);
  border-radius: 3px;
  overflow: hidden;
  opacity: 1;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.6s 0.25s;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 450px) {
    width: 100%;
    height: 80%;
  }
`;

const StyledButton = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

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

    [...(kohort?.members || []), ...(user?.childs || []), uid];

    kohort?.members.forEach((m) => newSet.add(m));
    user?.childs?.forEach((m) => newSet.add(m));
    newSet.add(uid);

    // Join group in group collection
    await firebase
      .firestore()
      .collection("groups")
      .doc(firstInvite)
      .update({
        members: Array.from(newSet),
      });

    // Add group to user
    await firebase
      .firestore()
      .collection("user")
      .doc(user?.uid)
      .update({
        groups: [...(user?.groups || []), firstInvite],
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
            groups: [...(childInfo.data()?.groups || []), firstInvite],
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
    <StyledBlurredBackground>
      <StyledInnerContent>
        <Spacer />
        <StyledBigHeader>
          Du er invitert til en kohort med navn:{" "}
          <strong>{kohort?.groupName}</strong>
        </StyledBigHeader>
        <Spacer />

        <p>
          Hvis du takker nei til invitasjonen må du få en ny invitasjon av
          eieren av kohorten.
        </p>

        <p>Her kommer en liste med de som er med fra før.</p>

        <p>Vil du være med?</p>
        <StyledButton>
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
        </StyledButton>
      </StyledInnerContent>
    </StyledBlurredBackground>
  );
};
