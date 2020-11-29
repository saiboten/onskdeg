import React, { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import styled from "styled-components";
import { BorderButton, ButtonNavigation } from "./common/Button";
import { Link } from "./common/Link";
import firebase from "./firebase/firebase";
import { ReactComponent as SettingsIcon } from "./images/settings.svg";
import { useSettings } from "../hooks/useSettings";
import { mutate } from "swr";
import { Spacer } from "./common/Spacer";

const StyledSettingsIcon = styled(SettingsIcon)`
  margin-left: 12px;
  width: 32px;
  height: 32px;
  fill: #fff;
`;

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
