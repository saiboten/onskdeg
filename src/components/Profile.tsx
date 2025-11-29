import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import styled from "styled-components";
import { BorderButton, ButtonNavigation } from "./common/Button";
import { Link } from "./common/Link";
import firebase from "./firebase/firebase";
import { useSettings } from "../hooks/useSettings";
import { mutate } from "swr";
import { Spacer } from "./common/Spacer";

const StyledBottomOptions = styled.div`
  display: flex;
  gap: 1rem;
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
      <p>
        Dark mode?
        <input
          name="darkMode"
          type="checkbox"
          onChange={toggleDarkMode}
          checked={settings?.darkMode ? true : false}
        />
      </p>
      <p>
        Vil du ha årstidsbasert tema?
        <input
          name="festivitasTheme"
          type="checkbox"
          onChange={toggleFestivitasTheme}
          checked={settings?.festivitasThemesEnabled ? true : false}
        />
      </p>
      <p>
        Skjul avkryssede gaver?
        <input
          name="hideGifts"
          type="checkbox"
          onChange={toggleHideGifts}
          checked={settings?.hideGifts ? true : false}
        />
      </p>
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
        <BorderButton onClick={handleDelete}>Slett bruker</BorderButton>
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
          <Link to="/settings">Innstillinger</Link>
        </BorderButton>

        <BorderButton>
          <Link to={`/addchild`}>Legg til ekstra bruker</Link>
        </BorderButton>
        <BorderButton
          style={{
            marginLeft: "1rem",
          }}
        >
          <Link to={`/mypurchases`}>Mine kjøp</Link>
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
