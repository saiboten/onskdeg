import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Button } from "../common/Button";
import { StyledLabelInputPair } from "../common/StyledLabelInputPair";
import { PageHeader, Panel } from "../common/Page";
import { StyledLabel } from "../common/Label";
import { Container } from "../common/Container";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Child } from "../../types/types";
import Spinner from "../common/Spinner";

interface Props {
  uid: string;
}

export function AddChild({ uid }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser(uid);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const newChildDoc = firebase.firestore().collection("user").doc();

    const newChild: Child = {
      name,
      parent: [user?.uid || ""],
      uid: newChildDoc.id,
      isChild: true,
      groups: [...(user?.groups ?? [])],
    };

    await newChildDoc.set(newChild);

    await firebase
      .firestore()
      .collection("user")
      .doc(user?.uid || "")
      .update({
        childs: [...(user?.childs ?? []), newChildDoc.id],
      });

    user?.groups.forEach(async (group) => {
      const groupData = await firebase
        .firestore()
        .collection("groups")
        .doc(group)
        .get();

      await firebase
        .firestore()
        .collection("groups")
        .doc(group)
        .update({
          members: [...(groupData.data()?.members ?? []), newChildDoc.id],
        });
    });

    invalidate(["user", uid]);
    navigate("/");
  }

  return (
    <Container>
      <PageHeader
        back={{ to: "/settings", label: "Innstillinger" }}
        title="Legg til ekstra bruker"
        subtitle="For barn, eller en felles ønskeliste med partneren din. Du kan dele styringen med andre etterpå."
      />
      <Panel>
        <form onSubmit={handleSubmit}>
          <StyledLabel htmlFor="child-name">Navn</StyledLabel>
          <StyledLabelInputPair>
            <StyledInput
              type="text"
              id="child-name"
              placeholder="F.eks. Emma"
              autoComplete={"off"}
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? <Spinner /> : "Opprett"}
            </Button>
          </StyledLabelInputPair>
          <p className="mt-8 text-[1.3rem] opacity-70">
            Brukeren blir med i alle gruppene dine.
          </p>
        </form>
      </Panel>
    </Container>
  );
}
