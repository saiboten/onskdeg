import { useState } from "react";
import { Container } from "../common/Container";
import { Wish } from "../../types/types";
import styled from "styled-components";
import Loading from "../common/Loading";
import firebase from "../firebase/firebase";
import { Detail } from "./Detail";
import { StyledLabel } from "../common/Label";
import { useWish } from "../../hooks/useWish";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { mutate } from "swr";
import { ALink } from "../common/Link";
import { format } from "date-fns";
import { StyledBigHeader } from "../common/StyledHeading";
import { useQuestions } from "../../hooks/useQuestions";
import { ListMyQuestions } from "./ListMyQuestions";
import { compressImage } from "../../util/imageCompression";
import Spinner from "../common/Spinner";

const StyledWrapper = styled.div`
  text-align: left;
  padding: 0 10px;
`;

const StyledTitle = styled.div`
  font-size: 24px;
  color: ${(props) => props.theme.text};
`;

const StyledDescription = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const StyledLink = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const StyledImage = styled.img`
  max-width: 40rem;
  width: 100%;
`;

const StyledFileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.label<{ $disabled?: boolean }>`
  display: inline-block;
  padding: 1rem 2rem;
  margin-top: 0.5rem;
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => props.theme.secondary};
  border-radius: 4px;
  cursor: ${(props) => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.4rem;
  transition: transform 0.2s, box-shadow 0.2s;
  opacity: ${(props) => props.$disabled ? 0.6 : 1};
  pointer-events: ${(props) => props.$disabled ? 'none' : 'auto'};

  &:hover {
    transform: ${(props) => props.$disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${(props) => props.$disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

const UploadStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
  font-size: 1.4rem;
  color: ${(props) => props.theme.text};
`;

interface Params {
  wishid: string | undefined;
  uid: string | undefined;
  [id: string]: string | undefined;
}

export function YourWishDetails() {
  const { wishid, uid } = useParams<Params>();
  const [uploading, setUploading] = useState(false);

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
      await mutate(["wish", uid]);
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
    mutate(["wish", uid]);
  };

  return (
    <Container>
      <StyledWrapper>
        <StyledTitle>
          <Detail fieldName="name" storeData={storeData} initialValue={name}>
            <StyledBigHeader>{name}</StyledBigHeader>
          </Detail>
        </StyledTitle>

        {uploading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <Spinner />
          </div>
        ) : (
          wish.image && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StyledImage src={wish.image} />
            </div>
          )
        )}

        {wish.isSuggestion && <p>Foreslått av: {suggestedByUser?.name}</p>}

        {!wish.isSuggestion && (
          <ListMyQuestions
            wishId={wishid ?? ""}
            myUid={uid ?? ""}
            questions={questions}
          />
        )}

        {date && (
          <StyledDescription>
            <StyledLabel>Lagt inn</StyledLabel>
            <p>{format(wish.date?.toDate() || new Date(), "dd.MM.yyyy")}</p>
          </StyledDescription>
        )}
        <StyledDescription>
          <StyledLabel>Beskrivelse</StyledLabel>
          <Detail
            fieldName="description"
            storeData={storeData}
            initialValue={wishDescription}
          >
            <p>{wishDescription}</p>
          </Detail>
        </StyledDescription>
        <StyledDescription>
          <StyledFileInput 
            type="file" 
            id="file-upload" 
            onChange={handleChange} 
            accept="image/*"
            disabled={uploading}
          />
          <FileUploadButton htmlFor="file-upload" $disabled={uploading}>
            Last opp bilde
          </FileUploadButton>
          {uploading && (
            <UploadStatus>
              <Spinner />
              <span>Laster opp bilde...</span>
            </UploadStatus>
          )}
        </StyledDescription>
        <StyledLink>
          <StyledLabel>Link</StyledLabel>
          <Detail fieldName="link" storeData={storeData} initialValue={link}>
            <ALink target="_blank" href={link}>
              {link}
            </ALink>
          </Detail>
        </StyledLink>
        <StyledLink>
          <StyledLabel>Pris</StyledLabel>
          <Detail
            fieldName="price"
            storeData={storeData}
            initialValue={price || 0}
          >
            <div>{price}</div>
          </Detail>
        </StyledLink>
      </StyledWrapper>
    </Container>
  );
}
