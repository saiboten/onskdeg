import { useState } from "react";
import { useParams } from "react-router-dom";
import { useKohorts } from "../../hooks/useKohorts";
import { useUser } from "../../hooks/useUser";
import { Kohort } from "../../types/types";
import { Container } from "../common/Container";
import Loading from "../common/Loading";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import { useNotification } from "../common/StyledNotification";
import { Checkbox } from "../common/Checkbox";
import { Link } from "../common/Link";

interface KohortMemberProps {
  uid: string;
  childId: string;
}

const KohortMember = ({ childId, uid }: KohortMemberProps) => {
  const { user } = useUser(uid);
  const [loading, setLoading] = useState(false);
  const [notificationText, setNotificationText] = useState(
    "Bruker bla er nå admin"
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
        : `${user?.name} er nå fjernet som administrator.`
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
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Checkbox
          label={user?.name}
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
    []
  );

  const userSet = new Set<string>();
  allusers?.forEach((m) => userSet.add(m));
  const filteredUserList = Array.from(userSet)
    .filter((m) => m !== childId)
    .filter((m) => m !== myUid);

  return (
    <Container textLeft>
      <Link className="mb-16 inline-block text-[1.4rem]" to="/settings">
        ← Tilbake til innstillinger
      </Link>
      <StyledBigHeader>{user?.name}</StyledBigHeader>
      <StyledSubHeader>Hvem andre skal styre {user?.name}?</StyledSubHeader>
      <div className="mt-12 flex flex-col gap-12">
        {filteredUserList?.map((user) => (
          <KohortMember key={user} uid={user} childId={childId ?? ""} />
        ))}
      </div>
    </Container>
  );
};
