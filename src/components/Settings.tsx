import React from "react";
import { Container } from "./common/Container";

import { BorderButton, Button } from "./common/Button";
import { Link } from "./common/Link";
import { Spacer } from "./common/Spacer";
import { useKohort } from "../hooks/useKohort";
import { useUser } from "../hooks/useUser";
import { StyledBigHeader, StyledSubHeader } from "./common/StyledHeading";

const ChildSetting = ({ childUid }: { childUid: string }) => {
  const { user } = useUser(childUid);

  return (
    <Link
      style={{
        marginRight: "1rem",
      }}
      to={`/settings/child/${user?.uid || ""}`}
    >
      <StyledSubHeader>{user?.name}</StyledSubHeader>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <StyledSubHeader>{kohort?.groupName}</StyledSubHeader>
      <Spacer />
      {kohort?.admin === myUid && (
        <Link to={`/settings/kohort/${kohort.id}`}>Administrer gruppe</Link>
      )}
      <Spacer />
      <Button>Forlate gruppen?</Button>
    </div>
  );
};

interface Props {
  uid: string;
}

export const Settings = ({ uid }: Props) => {
  const { user } = useUser(uid);

  return (
    <Container textLeft>
      <h1>Innstillinger</h1>
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
      <div
        style={{
          display: "flex",
        }}
      >
        {user?.childs?.map((childUid) => (
          <ChildSetting childUid={childUid} />
        ))}
      </div>
    </Container>
  );
};
