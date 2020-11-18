import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useKohorts } from "../hooks/useKohorts";
import { useUser } from "../hooks/useUser";
import { Kohort } from "../types/types";
import { Container } from "./common/Container";
import { StyledBigHeader } from "./common/StyledHeading";

interface KohortMemberProps {
  uid: string;
  childId: string;
}

const KohortMember = ({ childId, uid }: KohortMemberProps) => {
  const { user } = useUser(uid);

  function handleUserClick() {}

  const isParent = user?.childs?.includes(childId);

  return (
    <div>
      {user?.name} {isParent && <span>Forelder!!</span>}
    </div>
  );
};

interface Props {
  myUid: string;
}

export const ChildAdmin = ({ myUid }: Props) => {
  const { childId } = useParams<{ childId: string }>();
  const { user } = useUser(childId);
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
    <Container>
      <StyledBigHeader>{user?.name}</StyledBigHeader>
      {filteredUserList?.map((user) => (
        <KohortMember uid={user} childId={childId} />
      ))}
    </Container>
  );
};
