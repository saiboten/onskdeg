import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { Container } from "../common/Container";
import { NewsEntryType } from "../../types/types";
import { useUser } from "../../hooks/useUser";
import { useKohort } from "../../hooks/useKohort";
import { Link } from "../common/Link";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import { Spacer } from "../common/Spacer";

const StyledKohorts = styled.div`
  padding: 1rem;
`;

const StyledUl = styled.ul`
  list-style-type: none;
`;

export const GroupUser = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);

  return <Link to={`/other/${user?.uid}`}>{user?.name}</Link>;
};

const NewsFeedEntry = ({
  user: uid,
  wish,
  isSuggestion,
  suggestedBy,
  date,
}: NewsEntryType) => {
  const { user } = useUser(uid);
  const { user: suggestedByUser } = useUser(suggestedBy || "");

  return (
    <div
      style={{
        overflowWrap: "break-word",
        wordWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto",
      }}
    >
      {isSuggestion
        ? `${format(date.toDate(), "dd.MM 'kl' HH:mm")}: ${
            suggestedByUser?.name
          } foreslo et ønske for ${user?.name}`
        : `${format(date.toDate(), "dd.MM 'kl' HH:mm")}: ${
            user?.name
          } ønsker seg ${wish}`}
    </div>
  );
};

const LatestNews = ({ newsFeed }: { newsFeed: NewsEntryType[] }) => {
  return (
    <div>
      {newsFeed?.length === 0 && <div>Intet nytt under solen ...</div>}
      {newsFeed.map((props) => (
        <NewsFeedEntry key={`${props.date}-${props.wish || ""}`} {...props} />
      ))}
    </div>
  );
};

export const GroupUsers = ({
  uid,
  groupId,
}: {
  uid: string;
  groupId: string;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <StyledKohorts>
      <StyledBigHeader>
        Kohort: <strong>{kohort?.groupName}</strong>
      </StyledBigHeader>
      <Spacer />
      <StyledSubHeader>Siste nytt!</StyledSubHeader>
      <LatestNews newsFeed={kohort?.newsFeed ?? []}></LatestNews>
      <Spacer />
      <StyledSubHeader>Brukere</StyledSubHeader>
      <StyledUl>
        {kohort?.members
          .filter((member) => member !== uid)
          .map((member) => {
            return (
              <li key={member}>
                <GroupUser uid={member} />
              </li>
            );
          })}
      </StyledUl>
    </StyledKohorts>
  );
};

interface Props {
  uid: string;
}

export const SelectWishList = function ({ uid }: Props) {
  const { user } = useUser(uid);

  return (
    <Container textLeft>
      {user?.groups.length === 0 && (
        <div>
          Du er ikke med i noen kohorter enda. Enten må du få en invitasjon fra
          administrator i en annen kohort, eller{" "}
          <Link to="/settings">opprett en kokort her</Link>
        </div>
      )}

      {user?.groups.map((group) => {
        return <GroupUsers key={group} uid={uid} groupId={group} />;
      })}
    </Container>
  );
};
