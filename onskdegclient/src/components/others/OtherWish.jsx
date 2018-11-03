// @flow
import React from 'react';
import {
  any, func, string, bool,
} from 'prop-types';
import Linkify from 'react-linkify';
import store from '../../store';
import firebase from '../firebase/firebase';

const storageRef = firebase.storage().ref();

const debug = require('debug')('OtherWish');

class OtherWish extends React.Component {
  constructor(props) {
    super();

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
      wishInfo, suggestedBy, canDelete, deleteSuggestion, onClick,
    } = this.props;
    const { image } = this.state;

    const imageTag = wishInfo.image
      ? (<img className="other-wish__image" alt="Awesome" src={image} />) : '';

    const checkedBy = store.getState().users.filter(user => user.email === wishInfo.checkedby)[0];

    const suggestedByTemp = store.getState().users.filter((user) => {
      if (!suggestedBy) {
        return false;
      }
      return user.email === suggestedBy;
    })[0];
    const suggestedByUser = suggestedByTemp
      ? (
        <div className="smallspace">
          {`Foreslått av ${suggestedBy.name}`}
        </div>
      )
      : '';

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
        <div className="smallspace">
Tatt av
          {' '}
          {checkedBy ? checkedBy.name : ''}
        </div>
      )
      : '';
    const checkedText = wishInfo.checked
      ? 'Selg'
      : 'Kjøp';

    const deleteThis = canDelete
      ? (
        <input
          className="button other-wish__button_delete-suggestion"
          type="button"
          onClick={deleteSuggestion}
          value="Slett"
        />
      ) : '';

    return (
      <div className="flex-column border">
        <div className="flex-row other-wish__upper-half">
          <div className="flex-column smallspace other-wish__wish-text">
            {linkifyed}
            {imageTag}
          </div>
          <div className="flex-column other-wish__buy-or-sell-wrapper">
            <input
              className="button other-wish__button_buy-or-sell"
              onClick={() => onClick(wishInfo.id)}
              value={checkedText}
            />
            {deleteThis}
          </div>
        </div>
        <div className="flex-column">
          {suggestedByUser}
          {checkedByElem}
        </div>

      </div>
    );
  }
}

OtherWish.propTypes = {
  wishInfo: any,
  suggestedBy: string,
  onClick: func,
  deleteSuggestion: func,
  canDelete: bool,
};

export default OtherWish;
