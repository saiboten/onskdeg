// @flow
import React from 'react';
import Linkify from 'react-linkify';
import store from '../store';
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
    const image = this.props.wishInfo.image ?
    (<img className="other-wish__image" alt={'Awesome'} src={this.state.image} />) : '';

    const checkedBy = store.getState().allUserReducer.filter(user =>
      user.email === this.props.wishInfo.checkedby)[0];

    const suggestedBy = store.getState().allUserReducer.filter((user) => {
      if (!this.props.suggestedBy) {
        return false;
      }
      return user.email === this.props.suggestedBy;
    })[0];
    const suggestedByUser = suggestedBy
        ? (
          <div className="smallspace">Foreslått av {suggestedBy.name}</div>
        )
        : '';

    const item = this.props.wishInfo.checked
        ? (
          <del>{this.props.wishInfo.name}</del>
        )
        : this.props.wishInfo.name;
    const linkifyed = (
      <Linkify className="other-wish__linkify">{item}</Linkify>
    );
    const checkedByElem = this.props.wishInfo.checked
        ? (
          <div className="smallspace">Tatt av {checkedBy.name}</div>
        )
        : '';
    const checkedText = this.props.wishInfo.checked
        ? 'Selg'
        : 'Kjøp';

    const deleteThis = this.props.canDelete ?
    (<input
      className="button other-wish__button_delete-suggestion"
      type="button"
      onClick={this.props.deleteSuggestion}
      value="Slett"
    />) : '';

    return (
      <div className="flex-column border">
        <div className="flex-row other-wish__upper-half">
          <div className="flex-column smallspace other-wish__wish-text">{linkifyed}{image}
          </div>
          <div className="flex-column other-wish__buy-or-sell-wrapper">
            <input
              className="button other-wish__button_buy-or-sell"
              onClick={e => this.props.onClick(this.props.wishInfo.id)}
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
  wishInfo: React.PropTypes.object,
  suggestedBy: React.PropTypes.string,
  onClick: React.PropTypes.func,
  deleteSuggestion: React.PropTypes.func,
  canDelete: React.PropTypes.bool,
};

export default OtherWish;
