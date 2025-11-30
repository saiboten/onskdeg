import React, { useState } from "react";
import { Container } from "../common/Container";
import { StyledBigHeader } from "../common/StyledHeading";
import { useChilds } from "../../hooks/useChilds";
import { useUser } from "../../hooks/useUser";
import firebase from "../firebase/firebase";
import styled from "styled-components";
import { mutate } from "swr";
import { Wish as WishType, NewsEntryType } from "../../types/types";
import { Button } from "../common/Button";
import { Spacer } from "../common/Spacer";
import { generateWishDescription } from "../../services/openai";
import { compressImage } from "../../util/imageCompression";

interface Props {
  uid: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 60rem;
  margin: 0 auto;
`;

const Label = styled.label`
  font-size: 1.6rem;
  font-weight: 600;
`;

const Select = styled.select`
  font-size: 1.6rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.primaryLight};
  color: ${(props) => props.theme.text};
`;

const FileInput = styled.input`
  font-size: 1.4rem;
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressItem = styled.div`
  padding: 0.5rem;
  font-size: 1.4rem;
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.negative};
  font-size: 1.4rem;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: ${(props) => props.theme.secondary};
  font-size: 1.4rem;
  margin-top: 1rem;
`;

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

        // Analyze image with OpenAI
        setProgress((prev) => [...prev, `Analyserer ${file.name} med AI...`]);
        let wishName = tempWishName;
        let wishDescription = "";
        
        try {
          const analysis = await generateWishDescription(imageUrl);
          wishName = analysis.title || tempWishName;
          wishDescription = analysis.description || "";
          setProgress((prev) => [...prev, `AI-analyse fullført: "${wishName}"`]);
        } catch (error) {
          console.error("OpenAI analysis failed:", error);
          setProgress((prev) => [...prev, `⚠ AI-analyse feilet, bruker standardnavn`]);
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

      mutate(["wish", selectedUser]);
      setSuccess(`${successCount} av ${totalFiles} bilder lastet opp!`);
      setFiles(null);
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setError("En feil oppstod under opplasting. Prøv igjen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <StyledBigHeader>Last opp ønsker</StyledBigHeader>
      
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="user-select">Last opp til:</Label>
          <Spacer />
          <Select
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
          </Select>
        </div>

        <div>
          <Label htmlFor="file-input">Velg bilder:</Label>
          <Spacer />
          <FileInput
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        <Button type="submit" disabled={uploading || !files}>
          {uploading ? "Laster opp..." : "Last opp bilder"}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {progress.length > 0 && (
          <ProgressContainer>
            {progress.map((msg, idx) => (
              <ProgressItem key={idx}>{msg}</ProgressItem>
            ))}
          </ProgressContainer>
        )}
      </Form>
    </Container>
  );
};
