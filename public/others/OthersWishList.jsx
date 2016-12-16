// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import user from '../common/User';
import Comments from './Comments';
import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';

const debug = require('debug')('OthersWishList');

require('./otherwishlist.css');

const mapStateToProps = (state, ownProps) => {
  debug('mapDispatchToProps: ', state, ownProps);
  return { userlist: state.allUserReducer };
};

const mapDispatchToProps = (dispatch, ownProps) => ({});

class OthersWishList extends React.Component {

  constructor() {
    super();
    debug('constructor');
    this.state = {
      wishes: [], hideSelected: true, userState: '', feedback: '',
    };
    this.check = this.check.bind(this);
    this.updateWishState = this.updateWishState.bind(this);
    this.toggleShowSelected = this.toggleShowSelected.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');

    this.updateWishState();

    const userlist = this.props.userlist;
    userlist.forEach((userInUserList) => {
      if (userInUserList.uid === this.props.params.name) {
        debug('Found it! ', userInUserList);
        this.setState({ userState: userInUserList.name });
      }
    });
  }

  updateWishState() {
    debug('updateWishState');

    const wishesRef = firebase.database().ref(`wishes/${this.props.params.name}`);
    wishesRef.on('value', (snapshot) => {
      debug('Callback from wish list: ', snapshot);
      if (snapshot.val() != null) {
        const list = snapshot.val().wishes;
        debug('Data :', list);

        this.setState({ wishes: list });
      }
    });
  }

  check(id) {
    debug('check', id);
    const newWishList = this.state.wishes.map((e) => {
      if (id === e.id) {
        return {
          name: e.name,
          checked: !e.checked,
          id: e.id,
          checkedby: user.getUserEmail(),
        };
      }

      return e;
    });
    firebase.database().ref(`wishes/${this.props.params.name}`).set({ wishes: newWishList });
    this.setState({ wishes: newWishList, feedback: 'Du kjøpte eller solgte noe!' });
  }

  toggleShowSelected(e) {
    debug('toggleShowSelected', e);
    e.preventDefault();
    this.setState({
      hideSelected: !this.state.hideSelected,
    });
  }

  render() {
    const wishes = this.state.wishes.filter((el) => {
      debug('Wish to be filtered: ', el);
      return !el.checked || !this.state.hideSelected;
    }, this).map(wishInfo => (<OtherWish onClick={this.check} wishInfo={wishInfo} />)
    , this);

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">Ønskelisten til {this.state.userState}</h1>
          <Link className="grow button-navigation smallspace" to="/others">Tilbake</Link>
        </div>
        <hr />

        <h2>Dette ønsker {this.state.userState} seg</h2>
        <p>{this.state.feedback}</p>
        <ul>
          {wishes}
        </ul>

        <Suggestions username={this.state.userState} userUid={this.props.params.name} />
        <hr />
        <Comments params={this.props.params} />
        <div className="flex-row space-between">
          <button className="other-wishlist__toggle-selected space button" onClick={this.toggleShowSelected}>
            {this.state.hideSelected
                  ? 'Vis utkrysset' : 'Skjul utkrysset'}</button>
        </div>

      </Container>
    );
  }
}

OthersWishList.propTypes = {
  params: React.PropTypes.object,
  userlist: React.PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersWishList);
