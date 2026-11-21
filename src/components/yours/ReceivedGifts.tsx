import { useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { PartyPopper, Undo2 } from "lucide-react";
import { Wish } from "../../types/types";
import { useUser } from "../../hooks/useUser";
import { useChilds } from "../../hooks/useChilds";
import { useWishes } from "../../hooks/useWishes";
import { restoreWish } from "../../services/wishArchive";
import { Container } from "../common/Container";
import { IconButton } from "../common/Button";
import Spinner from "../common/Spinner";
import { Tab, TabContainer } from "../common/Tabs";
import { EmptyState, PageHeader, Section, WishThumb } from "../common/Page";
import { displayWishName, formatPrice } from "../../util/format";

const GiverName = ({ uid }: { uid?: string }) => {
  const { user } = useUser(uid ?? "");
  return <>{user?.name ? `Fra ${user.name}` : "Ukjent giver"}</>;
};

const toMillis = (wish: Wish) =>
  (wish.receivedAt ?? wish.archivedAt ?? wish.date)?.toMillis?.() ?? 0;

const GiftRow = ({ wish, owner }: { wish: Wish; owner: string }) => {
  const [restoring, setRestoring] = useState(false);
  const when = wish.received ? wish.receivedAt : wish.archivedAt;

  return (
    <li className="flex items-center gap-8 rounded-[12px] bg-primary p-8 pr-8">
      <RouterLink
        to={`/wish/${owner}/${wish.id}`}
        className="flex min-w-0 flex-1 items-center gap-12 text-text no-underline hover:opacity-80"
      >
        <WishThumb src={wish.image} />
        <span className="flex min-w-0 flex-col">
          <span className="line-clamp-2 font-semibold wrap-break-word">
            {displayWishName(wish.name)}
          </span>
          <span className="truncate text-[1.3rem] opacity-70">
            {wish.received && (
              <>
                <GiverName uid={wish.receivedFrom} />
                {" · "}
              </>
            )}
            {[
              when ? format(when.toDate(), "d. MMM yyyy", { locale: nb }) : "",
              formatPrice(wish.price),
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </RouterLink>
      <IconButton
        aria-label="Legg tilbake på ønskelisten"
        title="Legg tilbake på ønskelisten"
        className="opacity-60 hover:opacity-100"
        disabled={restoring}
        onClick={async () => {
          setRestoring(true);
          try {
            await restoreWish(wish.id, owner);
          } finally {
            setRestoring(false);
          }
        }}
      >
        {restoring ? <Spinner /> : <Undo2 size={20} />}
      </IconButton>
    </li>
  );
};

export const ReceivedGifts = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  const childs = useChilds(uid);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || uid;
  const { allWishes } = useWishes(activeTab);

  const isMe = activeTab === uid;
  const activeName = isMe
    ? user?.name
    : childs?.find((c) => c.uid === activeTab)?.name;

  const own = allWishes.filter((w) => !w.isSuggestion);
  const received = own
    .filter((w) => w.received)
    .sort((a, b) => toMillis(b) - toMillis(a));
  const archived = own
    .filter((w) => w.archived && !w.received)
    .sort((a, b) => toMillis(b) - toMillis(a));

  const byYear = new Map<string, Wish[]>();
  received.forEach((wish) => {
    const year = String(new Date(toMillis(wish)).getFullYear());
    byYear.set(year, [...(byYear.get(year) ?? []), wish]);
  });

  return (
    <Container>
      {childs && childs.length > 0 && (
        <TabContainer>
          <Tab $active={isMe} onClick={() => setSearchParams({})}>
            {user?.name}
          </Tab>
          {childs.map((child) => (
            <Tab
              key={child.uid}
              $active={activeTab === child.uid}
              onClick={() => setSearchParams({ tab: child.uid })}
            >
              {child.name}
            </Tab>
          ))}
        </TabContainer>
      )}

      <PageHeader
        back={{ to: "/profile", label: "Profil" }}
        title={
          isMe ? "Gaver jeg har fått" : `Gaver ${activeName ?? ""} har fått`
        }
        subtitle={
          received.length === 0
            ? "Ingen gaver registrert ennå"
            : `${received.length} ${received.length === 1 ? "gave" : "gaver"}`
        }
      />

      {received.length === 0 ? (
        <EmptyState
          icon={<PartyPopper size={32} />}
          title="Ingen gaver her ennå"
        >
          Når du får noe du ønsket deg, trykker du «Jeg fikk denne!» på ønsket.
          Da havner det her, sammen med hvem det var fra.
        </EmptyState>
      ) : (
        [...byYear.entries()].map(([year, wishes]) => (
          <Section key={year} title={year}>
            <ul className="flex list-none flex-col gap-8">
              {wishes.map((wish) => (
                <GiftRow key={wish.id} wish={wish} owner={activeTab} />
              ))}
            </ul>
          </Section>
        ))
      )}

      {archived.length > 0 && (
        <details className="mt-32">
          <summary className="cursor-pointer text-[1.5rem] font-semibold opacity-80 hover:opacity-100">
            Andre arkiverte ønsker ({archived.length})
          </summary>
          <p className="mt-6 mb-12 text-[1.4rem] opacity-70">
            Ønsker som er fjernet fra listen uten at de ble mottatt.
          </p>
          <ul className="flex list-none flex-col gap-8">
            {archived.map((wish) => (
              <GiftRow key={wish.id} wish={wish} owner={activeTab} />
            ))}
          </ul>
        </details>
      )}
    </Container>
  );
};
