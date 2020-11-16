import React from "react";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";

export const PrivacyPolicy = () => {
  return (
    <Container textLeft>
      <StyledBigHeader>Personvern</StyledBigHeader>
      <p>
        Vi tar personvern på alvor, og samler kun inn følgende data, for å
        muliggjøre invitasjoner i tjenesten: Epost.
      </p>
      <p>
        Tjenesten bruker tjenester fra Google sin firebase-skytjeneste, det
        betyr at data om brukere, ønsker, kommentarer og annen informasjon
        ligger lagret der, og følger Google sine personvernavtale som du finner
        under.
      </p>
      Private policy for bruk av Google sine firebase-tjenester:{" "}
      <a href="https://firebase.google.com/support/privacy">firebase</a>
    </Container>
  );
};
