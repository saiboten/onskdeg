import { cn } from "../../util/cn";
import { Suspense, useState } from "react";
import { Container } from "../common/Container";
import { Wish } from "../../types/types";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { Detail } from "./Detail";
import { useWish } from "../../hooks/useWish";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { invalidate } from "../../queryClient";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { PageHeader, Panel } from "../common/Page";
import { displayUrl, displayWishName, formatPrice } from "../../util/format";
import { enrichWishFromLink } from "../../services/wishFromLink";
import { getOgData } from "../../util/getOgData";
import { useQuestions } from "../../hooks/useQuestions";
import { ListMyQuestions } from "./ListMyQuestions";
import { compressImage } from "../../util/imageCompression";
import Spinner from "../common/Spinner";
import { BorderButton, Button, borderButton } from "../common/Button";
import {
  deleteWish,
  markReceivedIfBought,
  restoreWish,
} from "../../services/wishArchive";
import { ReceivedDialog } from "./ReceivedDialog";
import { generateWishDescription } from "../../services/ai";
import {
  Archive,
  ExternalLink,
  ImageUp,
  PackageCheck,
  PartyPopper,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react";

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
  const [fetching, setFetching] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");

  const { user } = useUser(uid ?? "");

  const { wish } = useWish(user?.uid || "?", wishid ?? "");
  const { user: suggestedByUser } = useUser(wish?.suggestedBy || "");
  const { questions } = useQuestions(wishid ?? "");
  const { user: giver } = useUser(wish?.receivedFrom || "");
  const navigate = useNavigate();
  const [receiving, setReceiving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [markingReceived, setMarkingReceived] = useState(false);
  const [restoring, setRestoring] = useState(false);

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
        await response.blob(),
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
    toggle: (hm: boolean) => void,
  ) => {
    const value =
      field === "price"
        ? Number(
            String(newData)
              .replace(/[^\d.,]/g, "")
              .replace(",", "."),
          ) || 0
        : typeof newData === "string"
          ? newData.trim()
          : newData;

    await storeWishDetails({ ...wish, [field]: value });
    toggle(false);
    invalidate(["wish", uid]);
  };

  async function handleFetchFromLink() {
    if (!wish?.link) return;
    setFetching(true);
    setFetchMessage("");
    try {
      // Meta tags are quick and free; Gemini fills in the rest.
      const og = await getOgData(wish.link);
      const result = await enrichWishFromLink(
        wish.id,
        wish.link,
        og,
        wish.link,
      );
      await invalidate(["wish", uid]);
      setFetchMessage(
        result === "changed"
          ? "Fylte inn info fra lenken."
          : result === "unchanged"
            ? "Fant ingen ny info om dette produktet."
            : "Klarte ikke å hente info akkurat nå. Prøv igjen senere.",
      );
    } finally {
      setFetching(false);
    }
  }

  const uploadButton = (
    <label
      htmlFor="file-upload"
      className={cn(
        borderButton,
        "flex-1",
        uploading && "pointer-events-none cursor-not-allowed opacity-60",
      )}
    >
      <ImageUp size={18} />
      {wish.image ? "Bytt bilde" : "Last opp bilde"}
    </label>
  );

  const me = firebase.auth().currentUser?.uid;
  const back = wish.isSuggestion
    ? { to: `/other/${uid}`, label: `Ønskelisten til ${user?.name ?? ""}` }
    : uid === me
      ? { to: "/", label: "Mine ønsker" }
      : { to: `/?tab=${uid}`, label: `Ønskene til ${user?.name ?? ""}` };

  const subtitle = [
    date && `Lagt inn ${format(date.toDate(), "d. MMMM yyyy", { locale: nb })}`,
    wish.isSuggestion &&
      suggestedByUser?.name &&
      `Foreslått av ${suggestedByUser.name}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Container wide>
      <PageHeader
        className="mb-20"
        back={back}
        title={
          <Detail
            fieldName="name"
            storeData={storeData}
            initialValue={name}
            placeholder="Gi ønsket et navn"
          >
            {displayWishName(name)}
          </Detail>
        }
        subtitle={subtitle || undefined}
      />

      {wish.archived && (
        <Panel className="mb-24 flex flex-wrap items-center gap-12 shadow-[inset_0_0_0_2px_var(--color-secondary)]">
          <span className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-secondary">
            {wish.received ? <PartyPopper size={20} /> : <Archive size={20} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {wish.received
                ? `Du fikk denne${giver?.name ? ` fra ${giver.name}` : ""}!`
                : "Dette ønsket er arkivert"}
            </p>
            <p className="text-[1.4rem] opacity-70">
              {wish.received && wish.receivedAt
                ? `Merket som mottatt ${format(wish.receivedAt.toDate(), "d. MMMM yyyy", { locale: nb })}. Det vises ikke lenger på ønskelisten.`
                : "Det vises ikke på ønskelisten."}
            </p>
          </div>
          <BorderButton
            disabled={restoring}
            onClick={async () => {
              setRestoring(true);
              try {
                await restoreWish(wish.id, uid ?? "");
              } finally {
                setRestoring(false);
              }
            }}
          >
            {restoring ? <Spinner /> : <Undo2 size={18} />}
            Legg tilbake på listen
          </BorderButton>
        </Panel>
      )}

      <div className="grid gap-24 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-12">
          <input
            className="hidden"
            type="file"
            id="file-upload"
            onChange={handleChange}
            accept="image/*"
            disabled={uploading}
          />
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] bg-primary">
            {uploading ? (
              <div className="flex items-center gap-8 text-[1.4rem]">
                <Spinner />
                <span>Laster opp bilde …</span>
              </div>
            ) : wish.image ? (
              <img
                className="h-full w-full bg-white object-contain"
                src={wish.image}
                alt={name}
              />
            ) : (
              <label
                htmlFor="file-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-8 text-[1.4rem] opacity-60 transition-opacity hover:opacity-100"
              >
                <ImageUp size={36} />
                Legg til bilde
              </label>
            )}
          </div>
          <div className="flex flex-wrap gap-8">
            {uploadButton}
            {wish.image && !uploading && (
              <BorderButton
                className="flex-1"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? <Spinner /> : <Sparkles size={18} />}
                {analyzing ? "Analyserer …" : "Beskriv med AI"}
              </BorderButton>
            )}
          </div>
          {analyzeError && (
            <p className="text-[1.4rem] text-negative">{analyzeError}</p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-24">
          <Panel className="flex flex-col gap-20">
            <Detail
              label="Pris"
              fieldName="price"
              type="number"
              storeData={storeData}
              initialValue={price || ""}
              placeholder="Legg til pris"
            >
              <span className="text-[2rem] font-semibold">
                {formatPrice(price)}
              </span>
            </Detail>
            <Detail
              label="Lenke"
              fieldName="link"
              type="url"
              storeData={storeData}
              initialValue={link}
              placeholder="Lim inn lenke til nettbutikk"
            >
              <a
                className="inline-flex items-center gap-6 font-semibold text-text no-underline [border-bottom:2px_solid_var(--color-secondary)] hover:opacity-75"
                target="_blank"
                rel="noreferrer"
                href={link}
              >
                {displayUrl(link)}
                <ExternalLink size={16} />
              </a>
            </Detail>
            <Detail
              label="Beskrivelse"
              fieldName="description"
              multiline
              storeData={storeData}
              initialValue={wishDescription}
              placeholder="Legg til beskrivelse, størrelse, farge …"
            >
              <p className="whitespace-pre-line">{wishDescription}</p>
            </Detail>
            {link && (
              <div className="flex flex-wrap items-center gap-12 [border-top:1px_solid_var(--color-secondary-dark)] pt-16">
                <BorderButton onClick={handleFetchFromLink} disabled={fetching}>
                  {fetching ? <Spinner /> : <Sparkles size={18} />}
                  {fetching ? "Henter info …" : "Hent info fra lenken"}
                </BorderButton>
                {fetchMessage && (
                  <span className="text-[1.4rem] opacity-75">
                    {fetchMessage}
                  </span>
                )}
              </div>
            )}
          </Panel>

          {!wish.archived && (
            <div className="flex flex-wrap items-center gap-8">
              {confirmDelete ? (
                <>
                  <span className="mr-4 text-[1.4rem]">
                    Slette ønsket? Dette kan ikke angres.
                  </span>
                  <BorderButton onClick={() => setConfirmDelete(false)}>
                    Avbryt
                  </BorderButton>
                  <Button
                    className="bg-negative text-white"
                    onClick={async () => {
                      await deleteWish(wish.id, uid ?? "");
                      navigate(back.to);
                    }}
                  >
                    Ja, slett
                  </Button>
                </>
              ) : (
                <>
                  {!wish.isSuggestion && (
                    <Button
                      disabled={markingReceived}
                      onClick={async () => {
                        // Bought: mark right away. Otherwise ask who gave it.
                        setMarkingReceived(true);
                        try {
                          const done = await markReceivedIfBought(
                            wish.id,
                            uid ?? "",
                          );
                          if (!done) setReceiving(true);
                        } finally {
                          setMarkingReceived(false);
                        }
                      }}
                    >
                      {markingReceived ? (
                        <Spinner />
                      ) : (
                        <PackageCheck size={18} />
                      )}
                      Jeg fikk denne!
                    </Button>
                  )}
                  <BorderButton onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={18} />
                    Slett
                  </BorderButton>
                </>
              )}
            </div>
          )}
          {receiving && (
            <Suspense fallback={null}>
              <ReceivedDialog
                wish={wish}
                owner={uid ?? ""}
                onClose={() => setReceiving(false)}
              />
            </Suspense>
          )}

          {!wish.isSuggestion && (
            <ListMyQuestions
              wishId={wishid ?? ""}
              myUid={uid ?? ""}
              questions={questions}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
