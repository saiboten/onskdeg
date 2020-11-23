import React, { useState } from "react";

import { Button } from "../common/Button";
import { Kohort } from "../../types/types";
import { StyledLabel } from "../common/Label";
import { StyledInput } from "../common/StyledInput";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import Loading from "../common/Loading";

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
    mutate(["groups"], kohortId);
    setNewUid("");
    setAddUidLoading(false);
  }

  return (
    <>
      <h3>Legg til bruker med ID</h3>
      <form onSubmit={handleAddUid}>
        <StyledLabel htmlFor="email">Bruker-ID</StyledLabel>
        <StyledLabelInputPair>
          <StyledInput
            autoComplete="off"
            id="uid"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
          ></StyledInput>
          {addUidLoading ? (
            <Loading />
          ) : (
            <Button disabled={newUid === ""} type="submit">
              Legg til
            </Button>
          )}
        </StyledLabelInputPair>
      </form>
    </>
  );
};
