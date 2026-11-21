import { useState } from "react";
import { useParams } from "react-router-dom";
import { useKohorts } from "../../hooks/useKohorts";
import { useUser } from "../../hooks/useUser";
import { Kohort } from "../../types/types";
import { Container } from "../common/Container";
import Spinner from "../common/Spinner";
import { Avatar, Divided, PageHeader, Panel, Section } from "../common/Page";
import firebase from "../firebase/firebase";
import { useNotification } from "../common/StyledNotification";
import { Checkbox } from "../common/Checkbox";

interface KohortMemberProps {
  uid: string;
  childId: string;
}

const KohortMember = ({ childId, uid }: KohortMemberProps) => {
  const { user } = useUser(uid);
  const [loading, setLoading] = useState(false);
  const [notificationText, setNotificationText] = useState(
    "Bruker bla er nå admin",
  );
  const { flash, element } = useNotification(notificationText);

  const [isParent, setIsParent] = useState(user?.childs?.includes(childId));

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    const target = event.target;
    const value = target.checked;
    setIsParent(value);
    setLoading(false);
    setNotificationText(
      value
        ? `${user?.name} er nå administrator.`
        : `${user?.name} er nå fjernet som administrator.`,
    );

    const childDocRef = firebase.firestore().collection("user").doc(childId);
    const childData = await childDocRef.get();

    const newParentDocRef = firebase.firestore().collection("user").doc(uid);
    const parentData = await newParentDocRef.get();

    if (value) {
      childDocRef.update({
        parent: [uid, ...childData.data()?.parent],
      });
      newParentDocRef.update({
        childs: [childId, ...parentData.data()?.childs],
      });
    } else {
      childDocRef.update({
        parent: childData.data()?.parent.filter((m: string) => m !== uid),
      });

      newParentDocRef.update({
        childs: parentData.data()?.childs.filter((m: string) => m !== childId),
      });
    }

    flash();
  }

  if (user?.isChild) {
    return null;
  }

  return (
    <div className="px-8 py-10">
      {loading ? (
        <Spinner />
      ) : (
        <Checkbox
          label={
            <span className="flex items-center gap-12">
              <Avatar name={user?.name} className="h-32 w-32 text-[1.2rem]" />
              {user?.name}
            </span>
          }
          name="isParent"
          checked={isParent ?? false}
          onChange={handleInputChange}
        />
      )}
      {element}
    </div>
  );
};

interface Props {
  myUid: string;
}

export const ChildAdmin = ({ myUid }: Props) => {
  const { childId } = useParams<{ childId: string }>();
  const { user } = useUser(childId ?? "");
  const kohortData = useKohorts(myUid);

  const allusers = kohortData?.reduce(
    (sum: string[], next: Kohort): string[] => {
      next.members.forEach((m) => {
        sum.push(m);
      });

      return sum;
    },
    [],
  );

  const userSet = new Set<string>();
  allusers?.forEach((m) => userSet.add(m));
  const filteredUserList = Array.from(userSet)
    .filter((m) => m !== childId)
    .filter((m) => m !== myUid);

  return (
    <Container>
      <PageHeader
        back={{ to: "/settings", label: "Innstillinger" }}
        title={
          <span className="flex items-center gap-12">
            <Avatar name={user?.name} className="h-44 w-44 text-[1.6rem]" />
            {user?.name}
          </span>
        }
      />
      <Section
        title="Hvem kan styre ønskelisten?"
        description={`De du slår på her kan legge til og endre ønskene til ${user?.name ?? "brukeren"}.`}
      >
        <Panel className="p-8 sm:p-8">
          {filteredUserList.length ? (
            <Divided>
              {filteredUserList.map((user) => (
                <KohortMember key={user} uid={user} childId={childId ?? ""} />
              ))}
            </Divided>
          ) : (
            <p className="p-8 opacity-70">
              Ingen andre i gruppene dine å velge mellom.
            </p>
          )}
        </Panel>
      </Section>
    </Container>
  );
};
