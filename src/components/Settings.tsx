import React from "react";
import { Container } from "./common/Container";
import { StyledActionButtons } from "./common/IconButton";
import { NavLink } from "react-router-dom";

export const Settings = () => {
  return (
    <Container>
      <h1>Settings</h1>
      <StyledActionButtons>
        <NavLink to="/addgroup">Opprett ny kohort</NavLink>
      </StyledActionButtons>
    </Container>
  );
};
