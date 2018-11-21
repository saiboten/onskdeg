import React from 'react';
import {
  any, func, bool,
} from 'prop-types';
import Linkify from 'react-linkify';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';

import './otherwish.css';
import { Wish } from '../../types/types';

const storageRef = firebase.storage().ref();

const debug = require('debug')('OtherWish');

interface P {
  wishInfo: Wish;
  canDelete: boolean;
  deleteSuggestion: () => void;
  onClick: Function;
};

interface S {
  image: string;
}

class OtherWish extends React.Component<P,S> {
  constructor(props: any) {
    super(props);

    this.state = {
      image: '',
    };

    if (props.wishInfo.image) {
      storageRef.child(props.wishInfo.image).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
    }
  }

  render() {
    const {
      wishInfo, canDelete, deleteSuggestion, onClick,
    } = this.props;
    const { image } = this.state;

    const imageTag = wishInfo.image
      ? (<img className="other-wish__image" alt="Awesome" src={image} />) : '';

    const item = wishInfo.checked
      ? (
        <del>{wishInfo.name}</del>
      )
      : wishInfo.name;
    const linkifyed = (
      <Linkify className="other-wish__linkify">{item}</Linkify>
    );
    const checkedByElem = wishInfo.checked
      ? (
        <div className="smallspace">Tatt</div>) : '';

    const deleteThis = canDelete
      ? (
        <button
          type="button"
          className="button other-wish__button_delete-suggestion"
          onClick={deleteSuggestion}
        >
          {'Slett'}
        </button>
      ) : '';

    return (
      <div className="flex-column border">
        <div className="flex-row other-wish__upper-half">
          <div className="flex-column smallspace other-wish__wish-text">
            {linkifyed}
            {imageTag}
          </div>
          <div className="other-wish__buy-or-sell-wrapper">

            <Icon type="button" name={wishInfo.checked ? 'shopping-cart' : 'shopping-cart'} onClick={() => onClick(wishInfo.id)} />
            {deleteThis}
          </div>
        </div>
        <div className="flex-column">
          {checkedByElem}
        </div>
      </div>
    );
  }
}

export default OtherWish;
