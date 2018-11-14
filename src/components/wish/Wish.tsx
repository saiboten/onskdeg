import React from 'react';
import { func, any } from 'prop-types';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import firebase from '../firebase/firebase';
import Icon from '../common/Icon';
import { Wish as WishType } from '../../types/types';

const storageRef = firebase.storage().ref();

const debug = require('debug')('Wish');

require('./wish.scss');

const StyledActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledWishAndActions = styled.div`
  display: flex;
  margin: 1rem;
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

class Wish extends React.Component<P,S> {

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

  updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
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
      checkedby: wish.checkedby,
      checked: wish.checked,
      image: wish.image,
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

    const image = wish.image ? (<img className="wish__image" alt="Awesome" src={imageState} />) : '';

    const deleteWish = confirm
      ? (
        <StyledActionButtons>
          <Icon type="button" name="x" onClick={this.cancel} />
          <Icon type="button" name="check" onClick={this.deleteConfirmed} />
        </StyledActionButtons>)
      : (
        <StyledActionButtons>
          <Icon type="button" name="trash-2" onClick={this.deleteItem} />
          <Dropzone className="wish__wish-dropzone" onDrop={this.onDrop}>
            <Icon type="button" name="upload" onClick={() => null} />
          </Dropzone>
        </StyledActionButtons>
      );

    const html = edit
      ? (<textarea
        className="wish__wish-text wish__wish-text--active"
        ref={(c) => { this.input = c; }}
        onBlur={this.focusLost}
        onChange={this.updateText}
        value={text}
      />
      )
      : (<textarea onClick={this.click} className="wish__wish-text" defaultValue={text} />);
    return (
      <div className="wish__one-wish">

        <StyledWishAndActions>
          {html}
          {deleteWish}
        </StyledWishAndActions>
        {image}
      </div>
    );
  }
}

export default Wish;
