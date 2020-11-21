import React from "react";
import { Container } from "../common/Container";

import { BorderButton, Button } from "../common/Button";
import { Link } from "../common/Link";
import { Spacer } from "../common/Spacer";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import styled from "styled-components";

const StyledGroup = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`;

const ChildSetting = ({ childUid }: { childUid: string }) => {
  const { user } = useUser(childUid);

  return (
    <Link
      style={{
        marginRight: "1rem",
      }}
      to={`/settings/child/${user?.uid || ""}`}
    >
      <StyledSubHeader>
        {user?.name} ({childUid})
      </StyledSubHeader>
    </Link>
  );
};

const GroupSetting = ({
  myUid,
  group: groupId,
}: {
  myUid: string;
  group: string;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <StyledGroup>
      <StyledSubHeader style={{ marginRight: "1rem" }}>
        {kohort?.groupName}
      </StyledSubHeader>
      {kohort?.admin === myUid && (
        <Link
          style={{ marginRight: "1rem" }}
          to={`/settings/kohort/${kohort.id}`}
        >
          Administrer gruppe
        </Link>
      )}
      <Spacer />
      <Button onClick={() => alert("Funksjon ikke støttet. Enda.")}>
        Forlate gruppen?
      </Button>
    </StyledGroup>
  );
};

const StyledWarning = styled.div`
  border: 5px red solid;
  border-radius: 5px;
  background: #fff;
  color: black;
  padding: 1rem;
  margin: 1rem;
`;

interface Props {
  uid: string;
  firebaseUser: firebase.User | undefined;
}

export const Settings = ({ uid, firebaseUser }: Props) => {
  const { user } = useUser(uid);
  const showNoEmailDisclaimer = !firebaseUser?.email;

  return (
    <Container textLeft>
      <h1>Innstillinger</h1>
      <Spacer />
      <p>Din bruker-id er: {uid}</p>
      <p>Din epost er: {firebaseUser?.email || "Ukjent"}</p>

      {showNoEmailDisclaimer && (
        <StyledWarning>
          Vi kunne ikke finne eposten din. Dette betyr at du ikke kan inviteres
          til kohorter. Send din id til administrator slik at vedkommende kan
          legge deg inn manuelt. Din id er: {uid}.
        </StyledWarning>
      )}

      <Spacer />
      <BorderButton>
        <Link to={`/addgroup`}>Opprett ny kohort</Link>
      </BorderButton>
      <StyledBigHeader>Administrer kohorter</StyledBigHeader>
      {user?.groups.map((group) => (
        <React.Fragment key={group}>
          <GroupSetting myUid={uid} group={group} />
          <Spacer />
        </React.Fragment>
      ))}
      <StyledBigHeader>Administrer brukere</StyledBigHeader>
      <StyledGroup>
        {user?.childs?.map((childUid) => (
          <ChildSetting childUid={childUid} />
        ))}
      </StyledGroup>
      <Spacer />
    </Container>
  );
};
