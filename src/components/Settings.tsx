import React from "react";
import { Container } from "./common/Container";

import { BorderButton } from "./common/Button";
import { Link } from "./common/Link";
import { Spacer } from "./common/Spacer";
import { useKohort } from "../hooks/useKohort";
import { useUser } from "../hooks/useUser";

const GroupSetting = ({ group: groupId }: { group: string }) => {
  const { kohort } = useKohort(groupId);

  return (
    <div>
      Du er med i {kohort?.groupName}. <button>Forlate gruppen?</button>
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
      {user?.groups.map((group) => (
        <GroupSetting group={group} />
      ))}
    </Container>
  );
};
