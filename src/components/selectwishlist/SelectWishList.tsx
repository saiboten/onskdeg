import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
import { StyledBigHeader } from "../common/StyledHeading";

const StyledKohorts = styled.div`
  border: 1px solid black;
  border-radius: 0.5rem;
  border-color: #fff;
  padding: 1rem;
`;

const StyledUl = styled.ul`
  list-style-type: none;
`;

export const GroupUser = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);

  return <Link to={`/other/${user?.uid}`}>{user?.name}</Link>;
};

export const GroupUsers = ({
  uid,
  groupId,
}: {
  uid: string;
  groupId: string;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <StyledKohorts>
      <StyledBigHeader>
        Kohort: <strong>{kohort?.groupName}</strong>
      </StyledBigHeader>
      <StyledUl>
        {kohort?.members
          .filter((member) => member !== uid)
          .map((member) => {
            return (
              <li key={member}>
                <GroupUser uid={member} />
              </li>
            );
          })}
      </StyledUl>
    </StyledKohorts>
  );
};

interface Props {
  uid: string;
}

export const SelectWishList = function ({ uid }: Props) {
  const { user } = useUser(uid);

  return (
    <Container textLeft>
      <StyledBigHeader>Hvem sin ønskeliste vil du se?</StyledBigHeader>

      {user?.groups.length === 0 && (
        <div>
          Du er ikke med i noen kohorter enda. Enten må du få en invitasjon fra
          administrator i en annen kohort, eller{" "}
          <Link to="/settings">opprett en kokort her</Link>
        </div>
      )}

      {user?.groups.map((group) => {
        return <GroupUsers key={group} uid={uid} groupId={group} />;
      })}
    </Container>
  );
};
