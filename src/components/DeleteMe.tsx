import { DangerButton } from "./common/Button";
import { Container } from "./common/Container";
import { PageHeader } from "./common/Page";

export const DeleteMe = () => {
  function handleDelete() {
    alert(
      "Erhm, denne funksjonen finnes egentlig, men send en melding til @saiboten på twitter, så kan jeg fikse!",
    );
  }

  return (
    <Container>
      <PageHeader
        back={{ to: "/profile", label: "Profil" }}
        title="Slett meg"
      />
      <p className="mb-10">
        I følge Europas Personvernforordningen GDPR har du krav på å få dine
        personlige data slettet. Dersom du ønsker dette, trykk bekreft under.
      </p>
      <p className="mb-10">Da vil din bruker slettes for alltid.</p>
      <p className="mb-20">
        PS: Det er ingen vei tilbake, så vær sikker på at dette er noe du
        ønsker.
      </p>
      <DangerButton onClick={handleDelete}>Slett</DangerButton>
    </Container>
  );
};
