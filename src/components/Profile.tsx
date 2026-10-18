import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { StyledBigHeader, StyledSubHeader } from "./common/StyledHeading";
import {
  BorderButton,
  borderButton,
  DangerButton,
} from "./common/Button";
import { Checkbox } from "./common/Checkbox";
import { LogOut, Settings, ShoppingCart, UserPlus } from "lucide-react";
import { UnstyledLink } from "./common/Link";
import firebase from "./firebase/firebase";
import { useSettings } from "../hooks/useSettings";
import { invalidate } from "../queryClient";

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
  const { settings } = useSettings(uid);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

  function logout() {
    console.log("Logged out");
  }

  async function toggleDarkMode(event: React.ChangeEvent<HTMLInputElement>) {
    await firebase.firestore().collection("settings").doc(uid).update({
      darkMode: event.target.checked,
    });
    invalidate(["settings", uid]);
  }

  async function toggleHideGifts(event: React.ChangeEvent<HTMLInputElement>) {
    await firebase.firestore().collection("settings").doc(uid).update({
      hideGifts: event.target.checked,
    });
    invalidate(["settings", uid]);
  }

  async function toggleFestivitasTheme(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    await firebase.firestore().collection("settings").doc(uid).update({
      festivitasThemesEnabled: event.target.checked,
    });
    invalidate(["settings", uid]);
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
      <StyledBigHeader className="mb-4">Profil for {user?.name}</StyledBigHeader>
      <p className="opacity-75">{user?.email}</p>

      <div className="my-24 flex flex-wrap gap-10">
        <UnstyledLink className={borderButton} to="/settings">
          <Settings size={18} />
          Innstillinger
        </UnstyledLink>
        <UnstyledLink className={borderButton} to="/addchild">
          <UserPlus size={18} />
          Legg til ekstra bruker
        </UnstyledLink>
        <UnstyledLink className={borderButton} to="/mypurchases">
          <ShoppingCart size={18} />
          Mine kjøp
        </UnstyledLink>
      </div>

      <StyledSubHeader>Visning</StyledSubHeader>
      <div className="mt-12 mb-32 flex flex-col gap-16">
        <Checkbox
          label="Dark mode"
          name="darkMode"
          onChange={toggleDarkMode}
          checked={settings?.darkMode ? true : false}
        />
        <Checkbox
          label="Årstidsbasert tema"
          name="festivitasTheme"
          onChange={toggleFestivitasTheme}
          checked={settings?.festivitasThemesEnabled ? true : false}
        />
        <Checkbox
          label="Skjul avkryssede gaver"
          name="hideGifts"
          onChange={toggleHideGifts}
          checked={settings?.hideGifts ? true : false}
        />
      </div>

      <BorderButton
        className="mb-32"
        type="button"
        onClick={() => logOut(setFeedback, logout)}
      >
        <LogOut size={18} />
        Logg ut
      </BorderButton>
      {feedback && <p className="-mt-20 mb-32">{feedback}</p>}

      <section className="rounded-[10px] border-2 border-solid border-negative p-16">
        <StyledSubHeader>Sletting av brukerdata</StyledSubHeader>
        <p className="mb-16">
          Dersom du ønsker å slette dine brukerdata kan du trykke på knappen
          under. Dine data vil bli slettet i løpet av få virkedager.
        </p>
        {deleteConfirm && !userDeleted && (
          <p className="mb-16 font-semibold">
            Er du sikker på at du vil slette brukerdata? Det er ingen vei
            tilbake!
          </p>
        )}
        {userDeleted ? (
          <p>
            Brukeren din vil bli slettet i løpet av få virkedager. Takk for at
            du brukte gaveønske.no!
          </p>
        ) : (
          <DangerButton onClick={handleDelete}>
            {deleteConfirm ? "Ja, slett bruker" : "Slett bruker"}
          </DangerButton>
        )}
      </section>
    </Container>
  );
};
