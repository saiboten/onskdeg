import React, { useState } from "react";
import { Container } from "../common/Container";
import { PageHeader, Panel } from "../common/Page";
import Spinner from "../common/Spinner";
import { Link } from "../common/Link";
import { CheckCircle2, ImagePlus, Upload } from "lucide-react";
import { useChilds } from "../../hooks/useChilds";
import { useUser } from "../../hooks/useUser";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { Wish as WishType, NewsEntryType } from "../../types/types";
import { Button } from "../common/Button";
import { StyledLabel } from "../common/Label";
import { inputStyle } from "../common/StyledInput";
import { cn } from "../../util/cn";
import { generateWishDescription } from "../../services/ai";
import { compressImage } from "../../util/imageCompression";

interface Props {
  uid: string;
}

export const UploadWishesPage = ({ uid }: Props) => {
  const [selectedUser, setSelectedUser] = useState(uid);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useUser(uid);
  const { user: selectedUserData } = useUser(selectedUser);
  const childs = useChilds(uid);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setError("Vennligst velg minst ett bilde");
      return;
    }

    setUploading(true);
    setProgress([]);
    setError("");
    setSuccess("");

    try {
      const totalFiles = files.length;
      let successCount = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setProgress((prev) => [...prev, `Behandler ${file.name}...`]);

        // Compress image
        const compressedBlob = await compressImage(file);
        setProgress((prev) => [
          ...prev,
          `${file.name} komprimert (${(compressedBlob.size / 1024).toFixed(0)}kb)`,
        ]);

        // Create temporary wish object
        const tempWishName = `Bilde ${new Date().toLocaleDateString("no-NO")} ${i + 1}`;
        const newWishObject: Omit<WishType, "id"> = {
          owner: selectedUser,
          name: tempWishName,
          image: "",
          deleted: false,
          description: "",
          link: "",
          isSuggestion: false,
          date: firebase.firestore.Timestamp.now(),
        };

        // Add wish to Firestore
        const newWishRef = await firebase
          .firestore()
          .collection("wish")
          .add(newWishObject);

        // Upload image to Firebase Storage
        setProgress((prev) => [...prev, `Laster opp ${file.name}...`]);
        const storageRef = firebase.storage().ref();
        const imagePath = storageRef.child(`/${newWishRef.id}`);
        await imagePath.put(compressedBlob);
        const imageUrl = await imagePath.getDownloadURL();

        // Analyze image with Gemini
        setProgress((prev) => [...prev, `Analyserer ${file.name} med AI...`]);
        let wishName = tempWishName;
        let wishDescription = "";

        try {
          const analysis = await generateWishDescription(compressedBlob);
          wishName = analysis.title || tempWishName;
          wishDescription = analysis.description || "";
          setProgress((prev) => [
            ...prev,
            `AI-analyse fullført: "${wishName}"`,
          ]);
        } catch (error) {
          console.error("AI analysis failed:", error);
          setProgress((prev) => [
            ...prev,
            `⚠ AI-analyse feilet, bruker standardnavn`,
          ]);
        }

        // Update wish with image URL, AI-generated name and description
        await newWishRef.update({
          id: newWishRef.id,
          image: imageUrl,
          name: wishName,
          description: wishDescription,
        });

        // Add to news feed for all groups the user belongs to
        selectedUserData?.groups.forEach(async (group) => {
          const groupRef = firebase.firestore().collection("groups").doc(group);
          const groupData = await groupRef.get();

          const newsFeed: NewsEntryType[] = groupData.data()?.newsFeed ?? [];
          newsFeed.unshift({
            isSuggestion: false,
            user: selectedUser,
            wish: wishName,
            date: firebase.firestore.Timestamp.now(),
          });

          await groupRef.update({
            newsFeed: newsFeed?.slice(0, 5) ?? [],
          });
        });

        setProgress((prev) => [...prev, `✓ ${file.name} lastet opp!`]);
        successCount++;
      }

      invalidate(["wish", selectedUser]);
      setSuccess(`${successCount} av ${totalFiles} bilder lastet opp!`);
      setFiles(null);
      // Reset file input
      const fileInput = document.getElementById(
        "file-input",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setError("En feil oppstod under opplasting. Prøv igjen.");
    } finally {
      setUploading(false);
    }
  };

  const fileCount = files?.length ?? 0;

  return (
    <Container>
      <PageHeader
        back={{ to: "/", label: "Mine ønsker" }}
        title="Last opp bilder"
        subtitle="Ta bilde av ting du ønsker deg. AI gir hvert bilde et navn og en beskrivelse, og de blir lagt til som ønsker."
      />

      <form className="flex flex-col gap-16" onSubmit={handleSubmit}>
        <Panel className="flex flex-col gap-20">
          {(childs?.length ?? 0) > 0 && (
            <div>
              <StyledLabel htmlFor="user-select">Legg til hos</StyledLabel>
              <select
                className={cn(inputStyle, "w-full cursor-pointer")}
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={uploading}
              >
                <option value={uid}>{user?.name || "Meg selv"}</option>
                {childs?.map((child) => (
                  <option key={child.uid} value={child.uid}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label
            htmlFor="file-input"
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-8 rounded-[14px] border-2 border-dashed border-secondary px-16 py-32 text-center transition-colors hover:bg-secondary-dark",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            <ImagePlus size={36} className="text-secondary" />
            <span className="font-semibold">
              {fileCount > 0
                ? `${fileCount} ${fileCount === 1 ? "bilde" : "bilder"} valgt`
                : "Velg bilder"}
            </span>
            <span className="text-[1.3rem] opacity-70">
              {fileCount > 0
                ? "Trykk for å velge på nytt"
                : "Du kan velge flere på en gang"}
            </span>
            <input
              className="sr-only"
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </Panel>

        <Button
          className="h-48"
          type="submit"
          disabled={uploading || fileCount === 0}
        >
          {uploading ? <Spinner /> : <Upload size={18} />}
          {uploading
            ? "Laster opp …"
            : fileCount > 1
              ? `Last opp ${fileCount} bilder`
              : "Last opp"}
        </Button>

        {error && <p className="text-[1.4rem] text-negative">{error}</p>}
        {success && (
          <p className="flex items-center gap-8 font-semibold">
            <CheckCircle2 size={18} className="text-secondary" />
            {success}{" "}
            <Link to={selectedUser === uid ? "/" : `/?tab=${selectedUser}`}>
              Se ønskelisten
            </Link>
          </p>
        )}

        {progress.length > 0 && (
          <Panel className="flex flex-col gap-4 text-[1.4rem]">
            {progress.map((msg, idx) => (
              <div key={idx} className="opacity-80">
                {msg}
              </div>
            ))}
          </Panel>
        )}
      </form>
    </Container>
  );
};
