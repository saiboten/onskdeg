import React from 'react';
import Dropzone from 'react-dropzone';
import styled, { keyframes } from 'styled-components';

import firebase from '../firebase/firebase';
import Icon from '../common/Icon';
import { Wish as WishType } from '../../types/types';
import colors from '../../styles/colors';
import ListRow, { LeftSection } from '../common/ListRow';
import { ImageWrapper } from '../common/Image';
import { NeutralIconButton, NegativeIconButton, GoldIconButton, StyledActionButtons, StyledActionButtonsAnimated } from '../common/IconButton';
import { Link as RouterLink } from 'react-router-dom';

const storageRef = firebase.storage().ref();

const debug = require('debug')('Wish');

const StyledThumbnailImage = styled.img`
  width: 36px;
  height: 36px;
`;

export const Link = styled(RouterLink)`
  text-decoration: none;

  &:visited, &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

interface P {
  wish: WishType
  addImage: (wish: WishType, imageName: string) => void;
  delete: (wishId: string) => void;
  update: (wish: WishType) => void;
}

interface S {
  edit: boolean,
  text: string,
  confirm: boolean,
  image: string
}

class Wish extends React.Component<P, S> {

  input: any;

  constructor(props: any) {
    super(props);
    this.state = {
      edit: false,
      text: props.wish.name,
      confirm: false,
      image: '',
    };
    this.click = this.click.bind(this);
    this.focusLost = this.focusLost.bind(this);
    this.updateText = this.updateText.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.cancel = this.cancel.bind(this);
    this.deleteConfirmed = this.deleteConfirmed.bind(this);
    this.onDrop = this.onDrop.bind(this);
    debug('props: ', props);

    if (props.wish.image) {
      storageRef.child(props.wish.image).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
    }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      text: nextProps.wish.name,
      confirm: nextProps.wish.confirm,
    });
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  onDrop(acceptedFiles: any, rejectedFiles: any) {
    debug('Looks like I dropped something', acceptedFiles, rejectedFiles);
    const { wish, addImage } = this.props;

    const imageName = `${wish.id}.${acceptedFiles[0].name.split('.')[1]}`;

    const uploadTask = storageRef.child(imageName)
      .put(acceptedFiles[0]);

    uploadTask.on('state_changed', () => {
    }, () => {
      debug('Error. Wups.');
    }, () => {
      debug('Success!');
      storageRef.child(imageName).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
      addImage(wish, imageName);
    });
  }

  updateText(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      text: e.target.value,
    });
  }

  deleteItem() {
    this.setState({
      confirm: true,
    });
  }

  cancel() {
    this.setState({
      confirm: false,
    });
  }

  deleteConfirmed() {
    const { delete: deleteProp, wish } = this.props;
    deleteProp(wish.id);
  }

  focusLost() {
    const { update, wish } = this.props;
    const { text } = this.state;

    this.setState({
      edit: false,
    });
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

  click() {
    this.setState({
      edit: true,
    });
  }

  render() {
    const { wish } = this.props;
    const {
      confirm, image: imageState, edit, text,
    } = this.state;

    const image = wish.image ? (<StyledThumbnailImage alt="Wish Image" src={imageState} />) : '';

    const deleteWish = confirm
      ? (
        <StyledActionButtonsAnimated>
          <NeutralIconButton type="button" name="x" onClick={this.cancel} />
          <NegativeIconButton type="button" name="check" onClick={this.deleteConfirmed} />
        </StyledActionButtonsAnimated>)
      : (
        <StyledActionButtons>
          <GoldIconButton type="button" name="trash-2" onClick={this.deleteItem} />
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
  }
}

export default Wish;
