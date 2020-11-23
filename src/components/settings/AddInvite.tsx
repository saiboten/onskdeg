import React, { useState } from "react";

import { Button } from "../common/Button";
import { StyledInput } from "../common/StyledInput";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import Loading from "../common/Loading";
import { Kohort, User } from "../../types/types";
import { StyledNotification } from "../common/StyledNotification";

interface AddInviteProps {
  kohort: Kohort;
  kohortId: string;
  user: User | undefined;
}

export const AddInvite = ({ kohort, kohortId, user }: AddInviteProps) => {
  const [newInvite, setNewInvite] = useState("");
  const [showInviteAdded, setShowInviteAdded] = useState("");

  const [addEmailLoading, setAddEmailLoading] = useState(false);

  function emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleAddEmail(e: React.FormEvent<HTMLFormElement>) {
    setAddEmailLoading(true);
    e.preventDefault();

    const newInviteIgnoreCase = newInvite.toLowerCase();

    const inviteRef = firebase
      .firestore()
      .collection("invites")
      .doc(newInviteIgnoreCase);

    const inviteData = await inviteRef.get();
    const set = new Set(inviteData.data()?.myInvites);
    set.add(kohort?.id);

    await inviteRef.set({
      myInvites: Array.from(set),
    });

    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        invites: [...(kohort?.invites ?? []), newInviteIgnoreCase],
      });

    try {
      const sendInvite = firebase.functions().httpsCallable("sendInvite");
      const result = await sendInvite({
        email: newInviteIgnoreCase,
        groupName: kohort.groupName,
        inviteFromUserName: user?.name ?? "Ukjent",
      });

      console.log(result);
    } catch (e) {
      // Email fails on localhost
      console.log(e);
    }

    setNewInvite("");
    mutate(["groups", kohort?.id]);
    setAddEmailLoading(false);
    setShowInviteAdded(`Sendte invitasjon til ${newInviteIgnoreCase}`);

    setTimeout(() => {
      setShowInviteAdded("");
    }, 2000);
  }

  return (
    <>
      <h3>Legg til ny invitasjon</h3>
      <form onSubmit={handleAddEmail}>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            id="email"
            value={newInvite}
            onChange={(e) => setNewInvite(e.target.value)}
          ></StyledInput>
          {addEmailLoading ? (
            <Loading />
          ) : (
            <Button disabled={!emailIsValid(newInvite)} type="submit">
              Legg til
            </Button>
          )}
        </StyledLabelInputPair>
        <StyledNotification
          active={showInviteAdded !== ""}
          text={showInviteAdded}
        />
      </form>
    </>
  );
};
