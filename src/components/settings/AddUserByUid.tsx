import React, { useState } from "react";

import { Button } from "../common/Button";
import { Kohort } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import Spinner from "../common/Spinner";

interface AddUserByUidProps {
  kohort: Kohort;
  kohortId: string;
}

export const AddUserByUid = ({ kohort, kohortId }: AddUserByUidProps) => {
  const [newUid, setNewUid] = useState("");
  const [addUidLoading, setAddUidLoading] = useState(false);

  async function handleAddUid(e: React.FormEvent<HTMLFormElement>) {
    setAddUidLoading(true);
    e.preventDefault();
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        members: [...(kohort?.members ?? []), newUid],
      });

    const docRef = firebase.firestore().collection("user").doc(newUid);

    const userData = await docRef.get();

    await firebase
      .firestore()
      .collection("user")
      .doc(newUid)
      .update({
        groups: [...(userData.data()?.groups ?? []), kohort.id],
      });

    // TODO notification
    invalidate(["groups", kohortId]);
    setNewUid("");
    setAddUidLoading(false);
  }

  return (
    <>
      <form onSubmit={handleAddUid}>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            id="uid"
            placeholder="Bruker-ID"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
          ></StyledInput>
          <Button disabled={addUidLoading || !newUid.trim()} type="submit">
            {addUidLoading ? <Spinner /> : "Legg til"}
          </Button>
        </StyledLabelInputPair>
      </form>
    </>
  );
};
