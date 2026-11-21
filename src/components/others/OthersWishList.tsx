import React, { useState } from "react";

import { Container } from "../common/Container";
import OtherWish from "./OtherWish";
import { useWishes } from "../../hooks/useWishes";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Avatar, EmptyState, PageHeader, Panel, Section } from "../common/Page";
import { StyledInput } from "../common/StyledInput";
import firebase from "../firebase/firebase";
import { NewsEntryType, Wish } from "../../types/types";
import { StyledNotification } from "../common/StyledNotification";
import { invalidate } from "../../queryClient";
import {
  enrichWishFromLink,
  prefillFromInput,
} from "../../services/wishFromLink";
import { Button } from "../common/Button";
import { Plus } from "lucide-react";

interface Params {
  uid: string;
  [id: string]: string | undefined;
}

export const OthersWishList = ({ myUid }: { myUid: string }) => {
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const { uid } = useParams<Params>();
  const { user } = useUser(uid ?? "");
  const { wishes } = useWishes(uid ?? "");

  async function handleAddSuggestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // queryClient.setQueryData(["wish", uid], [{ name: suggestion }, ...(wishes || [])]);

    const input = suggestion;
    if (!input.trim()) return;
    setSuggestion("");
    const { link, og: data } = await prefillFromInput(input);

    const newWish: Wish = {
      owner: uid ?? "",
      deleted: false,
      description: data?.description || "",
      id: "",
      image: data?.image || "",
      isSuggestion: true,
      name: data?.title || suggestion,
      link: link || "",
      suggestedBy: myUid,
      date: firebase.firestore.Timestamp.now(),
    };

    const docRef = await firebase.firestore().collection("wish").add(newWish);
    await docRef.update({
      id: docRef.id,
    });

    if (link) {
      const owner = uid;
      enrichWishFromLink(docRef.id, link, data, input).then((changed) => {
        if (changed === "changed") invalidate(["wish", owner]);
      });
    }

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: true,
        suggestedBy: myUid,
        user: uid ?? "",
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    setFeedback(`La til forslag ${data.title || input}`);
    invalidate(["wish", uid]);

    setTimeout(() => {
      setFeedback("");
    }, 3000);
  }

  const ownWishes = wishes
    ?.filter((m) => !m.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  const suggestions = wishes
    ?.filter((m) => m.isSuggestion)
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });

  const count = ownWishes?.length ?? 0;

  return (
    <Container>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <PageHeader
        back={{ to: "/others", label: "Grupper" }}
        title={
          <span className="flex items-center gap-12">
            <Avatar name={user?.name} className="h-44 w-44 text-[1.6rem]" />
            {`Ønskelisten til ${user?.name ?? ""}`}
          </span>
        }
        subtitle={
          count === 0
            ? "Ingen ønsker ennå"
            : `${count} ${count === 1 ? "ønske" : "ønsker"}`
        }
      />

      {count === 0 ? (
        <EmptyState
          title={`${user?.name ?? "Personen"} har ikke lagt inn noen ønsker ennå`}
        >
          Du kan legge inn et forslag lenger ned.
        </EmptyState>
      ) : (
        <ul className="flex list-none flex-col gap-8">
          {ownWishes?.map((wish) => (
            <OtherWish
              myUid={myUid}
              key={wish.id}
              user={uid ?? ""}
              wishInfo={wish}
            />
          ))}
        </ul>
      )}

      <Section
        className="mt-40"
        title="Forslag"
        description={`Tips de andre om gaveideer. ${user?.name ?? "Personen"} ser ikke forslagene.`}
      >
        <Panel className="mb-12">
          <form
            className="flex items-center gap-8"
            onSubmit={handleAddSuggestion}
          >
            <StyledInput
              type="text"
              aria-label="Nytt forslag"
              placeholder="Skriv et forslag eller lim inn en lenke"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
            <Button
              className="h-48 shrink-0 px-16 max-[450px]:w-48 max-[450px]:px-0"
              type="submit"
              name="check"
              aria-label="Legg til forslag"
            >
              <Plus size={22} />
              <span className="max-[450px]:hidden">Foreslå</span>
            </Button>
          </form>
        </Panel>

        {(suggestions?.length ?? 0) > 0 && (
          <ul className="flex list-none flex-col gap-8">
            {suggestions?.map((wish) => (
              <OtherWish
                myUid={myUid}
                key={wish.id}
                user={uid ?? ""}
                wishInfo={wish}
              />
            ))}
          </ul>
        )}
      </Section>
    </Container>
  );
};
