import React from "react";
import { Button } from "./common/Button";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";

export const DeleteMe = () => {
  function handleDelete() {
    alert(
      "Erhm, denne funksjonen finnes egentlig, men send en melding til @saiboten på twitter, så kan jeg fikse!"
    );
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Slett meg</StyledBigHeader>
      <p>
        I følge Europas Personvernforordningen GDPR har du krav på å få dine
        personlige data slettet. Dersom du ønsker dette, trykk bekreft under.
      </p>
      <p>Da vil din bruker slettes for alltid.</p>
      <p>
        PS: Det er ingen vei tilbake, så vær sikker på at dette er noe du
        ønsker.
      </p>
      <Button onClick={handleDelete}>Slett</Button>
    </Container>
  );
};
