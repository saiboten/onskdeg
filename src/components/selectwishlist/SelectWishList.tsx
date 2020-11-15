import React, { useEffect, useState } from "react";

import AddedUserLink from "./AddedUserLink";
import { Container } from "../common/Container";
import firebase from "../firebase/firebase";
import { User, FirebaseSnapshot } from "../../types/types";
import { P } from "../common/P";
import { Form } from "../common/Form";
import { StyledInput } from "../common/StyledInput";
import { Button } from "../common/Button";
import { useUser } from "../../hooks/useUser";
import { useKohort } from "../../hooks/useKohort";
import { Link } from "../common/Link";

export const GroupUser = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);

  console.log(user);

  return <Link to={`/other/${user?.uid}`}>{user?.name}</Link>;
};

export const GroupUsers = ({ groupId }: { groupId: string }) => {
  const { kohort } = useKohort(groupId);

  console.log(kohort);

  return (
    <div>
      <h1>{kohort?.groupName}</h1>
      {kohort?.members.map((member) => {
        return <GroupUser uid={member} />;
      })}
    </div>
  );
};

interface Props {
  uid: string;
}

export const SelectWishList = function ({ uid }: Props) {
  const { user } = useUser(uid);

  return (
    <Container textLeft>
      <h1>Velg ønskeliste</h1>

      {user?.groups.map((group) => {
        return <GroupUsers key={group} groupId={group} />;
      })}
    </Container>
  );
};
