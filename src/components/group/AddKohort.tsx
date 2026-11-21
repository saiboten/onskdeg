import React, { useState } from "react";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import { StyledLabel } from "../common/Label";
import { Button } from "../common/Button";
import firebase from "../firebase/firebase";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { PageHeader, Panel, Section } from "../common/Page";
import Spinner from "../common/Spinner";
import { X } from "lucide-react";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { invalidate } from "../../queryClient";

interface Props {
  uid: string;
}

export const AddKohort: React.FC<Props> = ({ uid }) => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { user } = useUser(uid);
  const navigate = useNavigate();

  async function handleAddGroup() {
    setSaving(true);
    const db = firebase.firestore();

    const docRef = await db.collection("groups").add({
      invites,
      admin: user?.uid,
      groupName,
      members: [user?.uid, ...(user?.childs ?? [])],
    });

    await docRef.update({
      id: docRef.id,
    });

    // Add current user to kohort
    await db
      .collection("user")
      .doc(user?.uid)
      .update({
        groups: [...(user?.groups ?? []), docRef.id],
      });

    // Add current users children to kohort as default
    user?.childs?.forEach(async (child) => {
      const childData = await db.collection("user").doc(child).get();

      await db
        .collection("user")
        .doc(child)
        .update({
          groups: [...(childData.data()?.groups ?? []), docRef.id],
        });
    });

    // Add all invites to invites collection
    invites.forEach(async (invite) => {
      const doc = db.collection("invites").doc(invite);
      var docDetails = await doc.get();

      doc.set({
        myInvites: [...(docDetails.data()?.myInvites ?? []), docRef.id],
      });
    });

    invalidate(["user", uid]);
    navigate(`/others?group=${docRef.id}`);
  }

  return (
    <Container>
      <PageHeader
        back={{ to: "/settings", label: "Innstillinger" }}
        title="Opprett gruppe"
        subtitle="Alle i gruppen kan se hverandres ønskelister."
      />
      <Section title="1. Gi gruppen et navn">
        <Panel>
          <StyledLabel htmlFor="groupName">Navn på gruppe</StyledLabel>
          <StyledInput
            autoComplete="off"
            id="groupName"
            placeholder="F.eks. Familien"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          ></StyledInput>
        </Panel>
      </Section>

      <Section
        title="2. Inviter medlemmer"
        description="Valgfritt – du kan også invitere folk senere."
      >
        <Panel>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const clean = email.trim().toLowerCase();
              if (!clean || invites.includes(clean)) return;
              setEmail("");
              setInvites([...invites, clean]);
            }}
          >
            <StyledLabel htmlFor="email">Epost</StyledLabel>
            <StyledLabelInputPair>
              <StyledInput
                autoComplete="off"
                type="email"
                id="email"
                placeholder="navn@eksempel.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></StyledInput>
              <Button type="submit" disabled={!email.trim()}>
                Legg til
              </Button>
            </StyledLabelInputPair>
          </form>

          {invites.length > 0 && (
            <ul className="mt-16 flex list-none flex-wrap gap-8">
              {invites.map((email: string) => (
                <li
                  key={email}
                  className="flex items-center gap-4 rounded-full bg-primary-dark py-4 pr-4 pl-12 text-[1.4rem]"
                >
                  {email}
                  <button
                    type="button"
                    aria-label={`Fjern ${email}`}
                    className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text opacity-60 hover:opacity-100"
                    onClick={() =>
                      setInvites(invites.filter((i) => i !== email))
                    }
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </Section>
      <Button
        className="h-48 w-full sm:w-auto sm:px-32"
        onClick={handleAddGroup}
        disabled={saving || !groupName.trim()}
      >
        {saving ? <Spinner /> : "Opprett gruppe"}
      </Button>
    </Container>
  );
};
