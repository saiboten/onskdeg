import { ComponentProps, Suspense, useEffect, useState } from "react";
import { Wish } from "./Wish";
import firebase from "../firebase/firebase";
import { invalidate, queryClient } from "../../queryClient";

import { Wish as WishType, NewsEntryType } from "../../types/types";
import { Container } from "../common/Container";

import { StyledInput } from "../common/StyledInput";
import { useUser } from "../../hooks/useUser";
import { useWishes } from "../../hooks/useWishes";
import { useInvites } from "../../hooks/useInvites";
import { useChilds } from "../../hooks/useChilds";
import Loading from "../common/Loading";
import { SelectName } from "../SelectName";
import { EmptyState, PageHeader, Panel } from "../common/Page";
import {
  enrichWishFromLink,
  prefillFromInput,
} from "../../services/wishFromLink";
import { Notifications } from "./Notifications";
import { SecretSantaBanner } from "./SecretSantaBanner";
import { ImagePlus, PartyPopper, Plus, Sparkles } from "lucide-react";
import { BorderButton, Button, borderButton } from "../common/Button";
import { UnstyledLink } from "../common/Link";
import { cn } from "../../util/cn";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvitePopup } from "./InvitePopup";
import { TabContainer, Tab } from "../common/Tabs";

export const StyledWrapper = (props: ComponentProps<"form">) => (
  <form className="flex items-center gap-8" {...props} />
);

interface Props {
  uid: string;
  firebaseUser?: firebase.User;
}

export const YourWishList = ({ uid, firebaseUser }: Props) => {
  const [newWish, setNewWish] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useUser(uid);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const childs = useChilds(user?.uid ?? "");
  const activeTab = searchParams.get("tab") || uid;

  useEffect(() => {
    if (!user?.email && firebaseUser?.email) {
      firebase.firestore().collection("user").doc(uid).update({
        email: firebaseUser?.email,
      });
    }
  }, []);

  const { wishes } = useWishes(activeTab);

  const { invites } = useInvites(firebaseUser?.email ?? "");

  const handleTabChange = (tabUid: string) => {
    setSearchParams({ tab: tabUid });
  };

  const activeUser =
    activeTab === uid ? user : childs?.find((c) => c.uid === activeTab);

  async function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newWish === "") {
      setFeedback("Ønsket kan ikke være tomt");
      return;
    }

    queryClient.setQueryData(
      ["wish", activeTab],
      [{ name: newWish }, ...(wishes || [])],
    );
    setNewWish("");

    const input = newWish;
    const { link, og: data } = await prefillFromInput(input);

    const newWishObject: WishType = {
      owner: activeTab,
      name: data?.title || newWish,
      id: "",
      image: data?.image || "",
      deleted: false,
      description: data?.description || "",
      link: link || "",
      isSuggestion: false,
      date: firebase.firestore.Timestamp.now(),
    };

    const newWishRef = await firebase
      .firestore()
      .collection("wish")
      .add(newWishObject);

    await newWishRef.update({
      id: newWishRef.id,
    });

    invalidate(["wish", activeTab]);

    if (link) {
      const owner = activeTab;
      enrichWishFromLink(newWishRef.id, link, data, input).then((changed) => {
        if (changed === "changed") invalidate(["wish", owner]);
      });
    }

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: false,
        user: activeTab,
        wish: data?.title || newWish,
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    setFeedback("");
    setNewWish("");
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={activeTab} key={el.id || el.name} wish={el} />;
  };

  const sortedWishes = wishes
    ?.filter((el) => !el.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });

  if (!user?.name) {
    return (
      <Suspense fallback={<Loading />}>
        <SelectName uid={uid} firebaseUser={firebaseUser} />
      </Suspense>
    );
  }

  const isMe = activeTab === uid;
  const count = sortedWishes?.length ?? 0;

  return (
    <Container>
      {(invites?.myInvites.length || 0) > 0 && (
        <InvitePopup
          firebaseUser={firebaseUser}
          uid={uid}
          invites={invites?.myInvites ?? []}
        />
      )}

      <Notifications myUid={uid} />

      {isMe && (
        <Suspense fallback={null}>
          <SecretSantaBanner uid={uid} />
        </Suspense>
      )}

      {childs && childs.length > 0 && (
        <TabContainer>
          <Tab $active={isMe} onClick={() => handleTabChange(uid)}>
            {user?.name}
          </Tab>
          {childs.map((child) => (
            <Tab
              key={child.uid}
              $active={activeTab === child.uid}
              onClick={() => handleTabChange(child.uid)}
            >
              {child.name}
            </Tab>
          ))}
        </TabContainer>
      )}

      <PageHeader
        title={isMe ? "Mine ønsker" : `Ønskene til ${activeUser?.name ?? ""}`}
        subtitle={
          count === 0
            ? "Ingen ønsker ennå"
            : `${count} ${count === 1 ? "ønske" : "ønsker"}`
        }
        actions={
          <UnstyledLink
            className={cn(borderButton, "min-h-36 py-2 text-[1.4rem]")}
            to={isMe ? "/received" : `/received?tab=${activeTab}`}
          >
            <PartyPopper size={16} />
            Har fått
          </UnstyledLink>
        }
      />

      <Panel className="mb-24">
        <StyledWrapper onSubmit={addWish}>
          <StyledInput
            type="text"
            aria-label="Nytt ønske"
            placeholder={
              isMe
                ? "Hva ønsker du deg?"
                : `Hva ønsker ${activeUser?.name ?? "du"} seg?`
            }
            value={newWish}
            onChange={(e) => {
              setNewWish(e.target.value);
              setFeedback("");
            }}
          />

          <Button
            className="h-48 shrink-0 px-16 max-[450px]:w-48 max-[450px]:px-0"
            type="submit"
            name="check"
            aria-label="Legg til ønske"
          >
            <Plus size={22} />
            <span className="max-[450px]:hidden">Legg til</span>
          </Button>

          <BorderButton
            className="h-48 w-48 shrink-0 px-0"
            type="button"
            name="upload"
            aria-label="Last opp bilder"
            title="Last opp bilder"
            onClick={() => navigate("/upload-wishes")}
          >
            <ImagePlus size={22} />
          </BorderButton>
        </StyledWrapper>
        {feedback ? (
          <p className="mt-8 text-[1.4rem] text-negative">{feedback}</p>
        ) : (
          <p className="mt-8 flex items-center gap-6 text-[1.3rem] opacity-70">
            <Sparkles size={14} className="shrink-0" />
            Lim inn en lenke, så henter vi navn, bilde og pris automatisk.
          </p>
        )}
      </Panel>

      {count === 0 ? (
        <EmptyState title="Ønskelisten er tom">
          Skriv inn et ønske eller lim inn en lenke over for å komme i gang.
        </EmptyState>
      ) : (
        <ul className="flex list-none flex-col gap-8">
          {sortedWishes?.map(wishToElement)}
        </ul>
      )}
    </Container>
  );
};
