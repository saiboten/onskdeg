import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";
import { BorderButton, ButtonNavigation, DangerButton } from "./common/Button";
import { UnstyledLink } from "./common/Link";
import firebase from "./firebase/firebase";
import { useSettings } from "../hooks/useSettings";
import { mutate } from "swr";
import { Spacer } from "./common/Spacer";

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

const checkboxLabel =
  "flex cursor-pointer items-center gap-12 text-[1.6rem] text-text select-none";

const checkbox =
  "relative h-24 w-24 cursor-pointer appearance-none rounded-[4px] border-2 border-solid border-secondary bg-primary-dark transition-all duration-200 ease-[ease] checked:border-secondary checked:bg-secondary checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-[1.8rem] checked:after:font-bold checked:after:text-text checked:after:content-['✓'] hover:border-primary-light hover:shadow-[0_0_0_2px_var(--color-secondary-dark)]";

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

      <div className="my-20 flex flex-col gap-15">
        <label className={checkboxLabel}>
          <input
            className={checkbox}
            name="darkMode"
            type="checkbox"
            onChange={toggleDarkMode}
            checked={settings?.darkMode ? true : false}
          />
          <span>Dark mode?</span>
        </label>

        <label className={checkboxLabel}>
          <input
            className={checkbox}
            name="festivitasTheme"
            type="checkbox"
            onChange={toggleFestivitasTheme}
            checked={settings?.festivitasThemesEnabled ? true : false}
          />
          <span>Vil du ha årstidsbasert tema?</span>
        </label>

        <label className={checkboxLabel}>
          <input
            className={checkbox}
            name="hideGifts"
            type="checkbox"
            onChange={toggleHideGifts}
            checked={settings?.hideGifts ? true : false}
          />
          <span>Skjul avkryssede gaver?</span>
        </label>
      </div>

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

      <div className="flex gap-10">
        <BorderButton>
          <UnstyledLink
            className="flex h-full w-full items-center justify-center"
            to="/settings"
          >
            Innstillinger
          </UnstyledLink>
        </BorderButton>

        <BorderButton>
          <UnstyledLink
            className="flex h-full w-full items-center justify-center"
            to={`/addchild`}
          >
            Legg til ekstra bruker
          </UnstyledLink>
        </BorderButton>
        <BorderButton
          style={{
            marginLeft: "1rem",
          }}
        >
          <UnstyledLink
            className="flex h-full w-full items-center justify-center"
            to={`/mypurchases`}
          >
            Mine kjøp
          </UnstyledLink>
        </BorderButton>
      </div>
      <ButtonNavigation
        type="button"
        onClick={() => logOut(setFeedback, logout)}
      >
        Logg ut
      </ButtonNavigation>
    </Container>
  );
};
