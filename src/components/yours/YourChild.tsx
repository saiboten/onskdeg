import React, { useState } from "react";
import { Wish as WishType, Child, NewsEntryType } from "../../types/types";
import { StyledInput } from "../common/StyledInput";
import { Wish } from "./Wish";
import { StyledWrapper } from "./YourWishList";
import firebase from "../firebase/firebase";
import { useWishes } from "../../hooks/useWishes";
import { invalidate, queryClient } from "../../queryClient";
import Loading from "../common/Loading";
import { useUser } from "../../hooks/useUser";
import { getOgData, OgResponseData } from "../../util/getOgData";
import { Button } from "../common/Button";
import { StyledSubHeader } from "../common/StyledHeading";
import { Check } from "lucide-react";

interface Props {
  child: Child;
  myUid: string;
}

export const YourChild = ({ child, myUid }: Props) => {
  const [newWish, setNewWish] = useState("");
  const { wishes, isLoading } = useWishes(child.uid);
  const { user } = useUser(myUid);

  async function deleteWish(deleteId: string) {
    await firebase.firestore().collection("wish").doc(deleteId).delete();
    invalidate(["wish", child?.uid]);
  }

  const wishToElement = (el: WishType) => {
    return <Wish user={child.uid} key={el.id} delete={deleteWish} wish={el} />;
  };

  const handleSaveWish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    queryClient.setQueryData(
      ["wish", child?.uid],
      [{ name: newWish }, ...(wishes || [])]
    );
    setNewWish("");

    let data: OgResponseData | undefined = undefined;
    let link: string | undefined = undefined;

    if (newWish.startsWith("https")) {
      data = await getOgData(newWish);
      link = newWish;
    }

    const emptyWish: WishType = {
      owner: child.uid,
      name: data?.title || newWish,
      deleted: false,
      description: data?.description || "",
      image: data?.image || "",
      link: link || "",
      isSuggestion: false,
      id: "",
      date: firebase.firestore.Timestamp.now(),
    };

    const newWishRef = await firebase
      .firestore()
      .collection("wish")
      .add(emptyWish);

    await newWishRef.update({
      id: newWishRef.id,
    });

    user?.groups.forEach(async (group) => {
      const groupRef = firebase.firestore().collection("groups").doc(group);
      const groupData = await groupRef.get();

      const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
      newsFeed.unshift({
        isSuggestion: false,
        user: child.uid,
        wish: data?.title || newWish,
        date: firebase.firestore.Timestamp.now(),
      });

      await groupRef.update({
        newsFeed: newsFeed?.slice(0, 5) ?? [],
      });
    });

    invalidate(["wish", child.uid]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mb-24">
      <StyledSubHeader>{child.name}</StyledSubHeader>
      <StyledWrapper onSubmit={handleSaveWish}>
        <StyledInput
          type="text"
          placeholder={`Legg inn ønske for ${child.name}`}
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
        />
        <Button
          className="h-48 w-48 shrink-0 px-0"
          type="submit"
          name="check"
          aria-label="Legg til ønske"
        >
          <Check size={24} />
        </Button>
      </StyledWrapper>
      {(wishes ?? []).length > 0 ? (
        (wishes ?? []).map(wishToElement)
      ) : (
        <div>Ingen ønsker lagt inn enda</div>
      )}
    </div>
  );
};
