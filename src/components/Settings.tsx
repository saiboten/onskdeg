import React from "react";
import { Container } from "./common/Container";

import { BorderButton } from "./common/Button";
import { Link } from "./common/Link";
import { Spacer } from "./common/Spacer";
import { useKohort } from "../hooks/useKohort";
import { useUser } from "../hooks/useUser";

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
    </Container>
  );
};
