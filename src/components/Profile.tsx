import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import styled from "styled-components";
import { BorderButton, ButtonNavigation, DangerButton } from "./common/Button";
import { UnstyledLink } from "./common/Link";
import firebase from "./firebase/firebase";
import { useSettings } from "../hooks/useSettings";
import { mutate } from "swr";
import { Spacer } from "./common/Spacer";

const StyledBottomOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ButtonLink = styled(UnstyledLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.6rem;
  cursor: pointer;
  user-select: none;
  color: ${(props) => props.theme.text};
`;

const StyledCheckbox = styled.input`
  appearance: none;
  width: 2.4rem;
  height: 2.4rem;
  border: 2px solid ${(props) => props.theme.secondary};
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: ${(props) => props.theme.primaryDark};

  &:checked {
    background-color: ${(props) => props.theme.secondary};
    border-color: ${(props) => props.theme.secondary};
  }

  &:checked::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${(props) => props.theme.text};
    font-size: 1.8rem;
    font-weight: bold;
  }

  &:hover {
    border-color: ${(props) => props.theme.primaryLight};
    box-shadow: 0 0 0 2px ${(props) => props.theme.secondaryDark};
  }
`;

function logOut(setFeedback: (n: string) => void, logout: () => void) {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        setFeedback("Du er nå logget ut");
        logout();
      },
      (e) => {
        console.log(e);
        setFeedback("Noe gikk galt under utlogging.");
      }
    );
}

export const Profile = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  const [feedback, setFeedback] = useState("");
  const { settings } = useSettings(uid, true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

  function logout() {
    console.log("Logged out");
  }

  async function toggleDarkMode(event: React.ChangeEvent<HTMLInputElement>) {
    await firebase.firestore().collection("settings").doc(uid).update({
      darkMode: event.target.checked,
    });
    mutate(["settings", uid]);
  }

  async function toggleHideGifts(event: React.ChangeEvent<HTMLInputElement>) {
    await firebase.firestore().collection("settings").doc(uid).update({
      hideGifts: event.target.checked,
    });
    mutate(["settings", uid]);
  }

  async function toggleFestivitasTheme(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    await firebase.firestore().collection("settings").doc(uid).update({
      festivitasThemesEnabled: event.target.checked,
    });
    mutate(["settings", uid]);
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
    } else {
      console.log("Deleting user");
      setUserDeleted(true);
    }
  }

  return (
    <Container textLeft>
      <StyledBigHeader>Profil for {user?.name}</StyledBigHeader>
      <p>{user?.email}</p>
      <Spacer />
      
      <SettingsSection>
        <CheckboxLabel>
          <StyledCheckbox
            name="darkMode"
            type="checkbox"
            onChange={toggleDarkMode}
            checked={settings?.darkMode ? true : false}
          />
          <span>Dark mode?</span>
        </CheckboxLabel>

        <CheckboxLabel>
          <StyledCheckbox
            name="festivitasTheme"
            type="checkbox"
            onChange={toggleFestivitasTheme}
            checked={settings?.festivitasThemesEnabled ? true : false}
          />
          <span>Vil du ha årstidsbasert tema?</span>
        </CheckboxLabel>

        <CheckboxLabel>
          <StyledCheckbox
            name="hideGifts"
            type="checkbox"
            onChange={toggleHideGifts}
            checked={settings?.hideGifts ? true : false}
          />
          <span>Skjul avkryssede gaver?</span>
        </CheckboxLabel>
      </SettingsSection>

      {feedback}
      <Spacer />
      <h1>Sletting av brukerdata</h1>
      <p>
        Dersom du ønsker å slette dine brukerdata kan du trykke på knappen
        under. Dine data vil bli slettet i løpet av få virkedager.
      </p>
      <Spacer />
      {deleteConfirm ? (
        <p>
          Er du sikker på at du vil slette brukerdata? Det er ingen vei tilbake!
        </p>
      ) : null}
      <Spacer />
      {userDeleted ? null : (
        <DangerButton onClick={handleDelete}>Slett bruker</DangerButton>
      )}

      {userDeleted ? (
        <p>
          Brukeren din vil bli slettet i løpet av få virkedager. Takk for at du
          brukte gaveønske.no!
        </p>
      ) : null}

      <Spacer />

      <StyledBottomOptions>
        <BorderButton>
          <ButtonLink to="/settings">Innstillinger</ButtonLink>
        </BorderButton>

        <BorderButton>
          <ButtonLink to={`/addchild`}>Legg til ekstra bruker</ButtonLink>
        </BorderButton>
        <BorderButton
          style={{
            marginLeft: "1rem",
          }}
        >
          <ButtonLink to={`/mypurchases`}>Mine kjøp</ButtonLink>
        </BorderButton>
      </StyledBottomOptions>
      <ButtonNavigation
        type="button"
        onClick={() => logOut(setFeedback, logout)}
      >
        Logg ut
      </ButtonNavigation>
    </Container>
  );
};
