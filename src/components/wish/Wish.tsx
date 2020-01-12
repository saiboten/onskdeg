import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import styled, { keyframes } from "styled-components";

import firebase from "../firebase/firebase";
import Icon from "../common/Icon";
import { Wish as WishType } from "../../types/types";
import colors from "../../styles/colors";
import ListRow, { LeftSection } from "../common/ListRow";
import { ImageWrapper } from "../common/Image";
import {
  NeutralIconButton,
  NegativeIconButton,
  GoldIconButton,
  StyledActionButtons,
  StyledActionButtonsAnimated
} from "../common/IconButton";
import { Link as RouterLink } from "react-router-dom";

const storageRef = firebase.storage().ref();

const StyledThumbnailImage = styled.img`
  width: 36px;
  height: 36px;
`;

export const Link = styled(RouterLink)`
  text-decoration: none;

  &:visited,
  &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

interface P {
  wish: WishType;
  addImage: (wish: WishType, imageName: string) => void;
  delete: (wishId: string) => void;
  update: (wish: WishType) => void;
}

export const Wish = (props: P) => {
  const { wish, delete: deleteProp, addImage, update } = props;

  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(props.wish.name);
  const [confirm, setConfirm] = useState(false);
  const [imageLink, setImageLink] = useState("");

  useEffect(() => {
    if (props.wish.image) {
      storageRef
        .child(props.wish.image)
        .getDownloadURL()
        .then(url => {
          setImageLink(url);
        });
    }
  }, []);

  function onDrop(acceptedFiles: any, rejectedFiles: any) {
    const imageName = `${wish.id}.${acceptedFiles[0].name.split(".")[1]}`;

    const uploadTask = storageRef.child(imageName).put(acceptedFiles[0]);

    uploadTask.on(
      "state_changed",
      () => {},
      () => {
        console.log("Error. Handle this?");
      },
      () => {
        storageRef
          .child(imageName)
          .getDownloadURL()
          .then(url => {
            setImageLink(url);
          });
        addImage(wish, imageName);
      }
    );
  }

  function deleteItem() {
    setConfirm(true);
  }

  function cancel() {
    setConfirm(false);
  }

  function deleteConfirmed() {
    deleteProp(wish.id);
  }

  function focusLost() {
    setEdit(false);
    update({
      name: text,
      id: wish.id,
      image: wish.image,
      description: wish.description,
      accomplished: wish.accomplished,
      accomplishedby: wish.accomplishedby,
      deleted: wish.deleted,
      link: wish.link
    });
  }

  function click() {
    setEdit(true);
  }

  const image = wish.image ? (
    <StyledThumbnailImage alt="Wish Image" src={imageLink} />
  ) : (
    ""
  );

  const deleteWish = confirm ? (
    <StyledActionButtonsAnimated>
      <NeutralIconButton type="button" name="x" onClick={cancel} />
      <NegativeIconButton
        type="button"
        name="check"
        onClick={deleteConfirmed}
      />
    </StyledActionButtonsAnimated>
  ) : (
    <StyledActionButtons>
      <GoldIconButton type="button" name="trash-2" onClick={deleteItem} />
    </StyledActionButtons>
  );

  return (
    <ListRow>
      <LeftSection>
        <ImageWrapper>{image}</ImageWrapper>
        <Link to={`/wish/${wish.id}`}>{text}</Link>
      </LeftSection>
      {deleteWish}
    </ListRow>
  );
};
