import { cn } from "../../util/cn";
import { useState } from "react";
import { Container } from "../common/Container";
import { Wish } from "../../types/types";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { Detail } from "./Detail";
import { StyledLabel } from "../common/Label";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { invalidate } from "../../queryClient";
import { ALink } from "../common/Link";
import { format } from "date-fns";
import { StyledBigHeader } from "../common/StyledHeading";
import { useQuestions } from "../../hooks/useQuestions";
import { ListMyQuestions } from "./ListMyQuestions";
import { compressImage } from "../../util/imageCompression";
import Spinner from "../common/Spinner";
import { BorderButton, borderButton } from "../common/Button";
import { generateWishDescription } from "../../services/ai";
import { ImageUp, Sparkles } from "lucide-react";

interface Params {
  wishid: string | undefined;
  uid: string | undefined;
  [id: string]: string | undefined;
}

export function YourWishDetails() {
  const { wishid, uid } = useParams<Params>();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const { user } = useUser(uid ?? "");

  const { wish } = useWish(user?.uid || "?", wishid ?? "");
  const { user: suggestedByUser } = useUser(wish?.suggestedBy || "");
  const { questions } = useQuestions(wishid ?? "");

  async function storeWishDetails(updatedWish: Wish) {
    await firebase
      .firestore()
      .collection("wish")
      .doc(updatedWish.id)
      .update({
        ...updatedWish,
      });
  }

  if (wish == null) {
    return <Loading />;
  }

  const { name, description: wishDescription, link, price, date } = wish;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e?.target?.files;
    const fileToUpload = fileList ? fileList[0] : undefined;
    if (fileToUpload) {
      handleUpload(fileToUpload);
    }
  }

  async function handleAnalyze() {
    if (!wish?.image) {
      return;
    }

    setAnalyzing(true);
    setAnalyzeError("");
    try {
      const response = await fetch(wish.image);
      if (!response.ok) {
        throw new Error(`Could not download image: ${response.status}`);
      }
      const { title, description } = await generateWishDescription(
        await response.blob()
      );
      if (!title) {
        throw new Error("AI analysis returned no title");
      }
      await firebase.firestore().collection("wish").doc(wish.id).update({
        name: title,
        description,
      });
      await invalidate(["wish", uid]);
    } catch (error) {
      console.error("AI analysis failed:", error);
      setAnalyzeError("AI-analysen feilet. Prøv igjen senere.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleUpload(fileToUpload: File) {
    if (!fileToUpload) {
      return;
    }

    setUploading(true);
    try {
      // Compress the image before uploading
      const compressedBlob = await compressImage(fileToUpload);

      var storageRef = firebase.storage().ref();
      const path = storageRef.child(`/${wish?.id}`);

      await path.put(compressedBlob);
      const url = await path.getDownloadURL();
      await firebase.firestore().collection("wish").doc(wish?.id).update({
        image: url,
      });
      await invalidate(["wish", uid]);
    } finally {
      setUploading(false);
    }
  }

  const storeData = async (
    field: string,
    newData: string | number,
    toggle: (hm: boolean) => void
  ) => {
    const storeThis = {
      ...wish,
      [field]: newData,
    };

    await storeWishDetails(storeThis);
    toggle(false);
    invalidate(["wish", uid]);
  };

  const uploadButton = (
    <label
      htmlFor="file-upload"
      className={cn(
        borderButton,
        uploading && "pointer-events-none cursor-not-allowed opacity-60"
      )}
    >
      <ImageUp size={18} />
      {wish.image ? "Bytt bilde" : "Last opp bilde"}
    </label>
  );

  return (
    <Container textLeft>
      <Detail fieldName="name" storeData={storeData} initialValue={name}>
        <StyledBigHeader className="mb-0">{name}</StyledBigHeader>
      </Detail>

      <input
        className="hidden"
        type="file"
        id="file-upload"
        onChange={handleChange}
        accept="image/*"
        disabled={uploading}
      />

      <div className="my-20 flex flex-col items-center gap-12">
        {uploading ? (
          <div className="flex min-h-200 items-center justify-center gap-8 text-[1.4rem]">
            <Spinner />
            <span>Laster opp bilde...</span>
          </div>
        ) : (
          wish.image && (
            <img
              className="w-full max-w-400 rounded-[10px]"
              src={wish.image}
              alt={name}
            />
          )
        )}
        <div className="flex flex-wrap justify-center gap-10">
          {wish.image && !uploading && (
            <BorderButton onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? <Spinner /> : <Sparkles size={18} />}
              {analyzing ? "Analyserer..." : "Analyser med AI"}
            </BorderButton>
          )}
          {uploadButton}
        </div>
        {analyzeError && (
          <p className="text-[1.4rem] text-negative">{analyzeError}</p>
        )}
      </div>

      {wish.isSuggestion && (
        <p className="mb-16">Foreslått av: {suggestedByUser?.name}</p>
      )}

      {!wish.isSuggestion && (
        <ListMyQuestions
          wishId={wishid ?? ""}
          myUid={uid ?? ""}
          questions={questions}
        />
      )}

      <div className="flex flex-col gap-16">
        {date && (
          <div>
            <StyledLabel>Lagt inn</StyledLabel>
            <p className="flex min-h-40 items-center">
              {format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}
            </p>
          </div>
        )}
        <div>
          <StyledLabel>Beskrivelse</StyledLabel>
          <Detail
            fieldName="description"
            storeData={storeData}
            initialValue={wishDescription}
          >
            <p>{wishDescription}</p>
          </Detail>
        </div>
        <div>
          <StyledLabel>Link</StyledLabel>
          <Detail fieldName="link" storeData={storeData} initialValue={link}>
            <ALink target="_blank" href={link}>
              {link}
            </ALink>
          </Detail>
        </div>
        <div>
          <StyledLabel>Pris</StyledLabel>
          <Detail
            fieldName="price"
            storeData={storeData}
            initialValue={price || 0}
          >
            <p>Kr {price},-</p>
          </Detail>
        </div>
      </div>
    </Container>
  );
}
