import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Container } from "./common/Container";
import { BorderButton, DangerButton } from "./common/Button";
import { Checkbox } from "./common/Checkbox";
import { LogOut, Settings, ShoppingCart, UserPlus } from "lucide-react";
import firebase from "./firebase/firebase";
import { useSettings } from "../hooks/useSettings";
import { invalidate } from "../queryClient";
import { Avatar, Divided, LinkRow, Panel, Section } from "./common/Page";

export const Profile = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  const [feedback, setFeedback] = useState("");
  const { settings } = useSettings(uid);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

  async function updateSetting(
    field: "darkMode" | "hideGifts" | "festivitasThemesEnabled",
    value: boolean,
  ) {
    await firebase
      .firestore()
      .collection("settings")
      .doc(uid)
      .update({ [field]: value });
    invalidate(["settings", uid]);
  }

  function logOut() {
    firebase
      .auth()
      .signOut()
      .catch((e) => {
        console.log(e);
        setFeedback("Noe gikk galt under utlogging.");
      });
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
    } else {
      setUserDeleted(true);
    }
  }

  return (
    <Container>
      <header className="mb-32 flex items-center gap-16">
        <Avatar name={user?.name} className="h-64 w-64 text-[2.2rem]" />
        <div className="min-w-0">
          <h1 className="text-[2.8rem] leading-[1.2] font-semibold wrap-break-word">
            {user?.name}
          </h1>
          {user?.email && (
            <p className="truncate text-[1.5rem] opacity-70">{user.email}</p>
          )}
        </div>
      </header>

      <Section>
        <Panel className="p-8 sm:p-8">
          <Divided>
            <LinkRow
              to="/mypurchases"
              icon={<ShoppingCart size={18} />}
              label="Mine kjøp"
              description="Gaver du har merket som kjøpt"
            />
            <LinkRow
              to="/settings"
              icon={<Settings size={18} />}
              label="Innstillinger"
              description="Grupper, ekstra brukere og konto"
            />
            <LinkRow
              to="/addchild"
              icon={<UserPlus size={18} />}
              label="Legg til ekstra bruker"
              description="For barn eller en felles ønskeliste"
            />
          </Divided>
        </Panel>
      </Section>

      <Section title="Visning">
        <Panel>
          <Divided className="[&>*]:py-12 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
            <Checkbox
              label="Mørk modus"
              name="darkMode"
              onChange={(e) => updateSetting("darkMode", e.target.checked)}
              checked={!!settings?.darkMode}
            />
            <Checkbox
              label="Årstidsbasert tema"
              description="F.eks. juletema i desember"
              name="festivitasTheme"
              onChange={(e) =>
                updateSetting("festivitasThemesEnabled", e.target.checked)
              }
              checked={!!settings?.festivitasThemesEnabled}
            />
            <Checkbox
              label="Skjul kjøpte gaver"
              description="Gjelder ønskelistene til andre"
              name="hideGifts"
              onChange={(e) => updateSetting("hideGifts", e.target.checked)}
              checked={!!settings?.hideGifts}
            />
          </Divided>
        </Panel>
      </Section>

      <Section>
        <BorderButton type="button" onClick={logOut}>
          <LogOut size={18} />
          Logg ut
        </BorderButton>
        {feedback && <p className="mt-8 text-negative">{feedback}</p>}
      </Section>

      <Section
        title="Slett bruker"
        description="Dine data slettes i løpet av noen få virkedager."
      >
        <Panel className="shadow-[inset_0_0_0_2px_var(--color-negative)]">
          {userDeleted ? (
            <p>
              Brukeren din vil bli slettet i løpet av få virkedager. Takk for at
              du brukte gaveønske.no!
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-12">
              <p className="min-w-0 flex-1">
                {deleteConfirm
                  ? "Er du helt sikker? Det er ingen vei tilbake."
                  : "Be om at brukeren din og dataene dine slettes."}
              </p>
              <div className="flex gap-8">
                {deleteConfirm && (
                  <BorderButton onClick={() => setDeleteConfirm(false)}>
                    Avbryt
                  </BorderButton>
                )}
                <DangerButton onClick={handleDelete}>
                  {deleteConfirm ? "Ja, slett bruker" : "Slett bruker"}
                </DangerButton>
              </div>
            </div>
          )}
        </Panel>
      </Section>
    </Container>
  );
};
