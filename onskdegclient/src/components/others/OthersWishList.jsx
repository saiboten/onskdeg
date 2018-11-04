import React from 'react';
import { any, array } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import Comments from './Comments';
import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';
import userlistFirebase from '../users/userlistFirebase';

const debug = require('debug')('OthersWishList');

require('./otherwishlist.css');

const mapStateToProps = (state, ownProps) => {
  debug('mapDispatchToProps: ', state, ownProps);
  return { userlist: state.allUserReducer };
};

class OthersWishList extends React.Component {
  static componentDidUnmount() {
    debug('componentDidUnmount');

    userlistFirebase.unsubscribe();
  }

  constructor(props) {
    super(props);
    debug('constructor');
    this.state = {
      wishes: [], hideSelected: true, userState: '', feedback: '',
    };
    this.check = this.check.bind(this);
    this.updateWishState = this.updateWishState.bind(this);
    this.toggleShowSelected = this.toggleShowSelected.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount', this.props);
    const { userlist, match: { params: { name } } } = this.props;

    userlistFirebase.subscribe();
    this.updateWishState();

    userlist.forEach((userInUserList) => {
      if (userInUserList.uid === name) {
        debug('Found it! ', userInUserList);
        this.setState({ userState: userInUserList.name });
      }
    });
  }

  updateWishState() {
    debug('updateWishState');
    const { match: { params: { name } } } = this.props;

    const wishesRef = firebase.database().ref(`wishes/${name}`);
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
    const { user, params: { name } } = this.props;
    const { wishes } = this.state;

    const newWishList = wishes.map((e) => {
      if (id === e.id) {
        return {
          name: e.name,
          checked: !e.checked,
          id: e.id,
          checkedby: user.email,
          checkedTime: new Date(),
        };
      }

      return e;
    });
    firebase.database().ref(`wishes/${name}`).set({ wishes: newWishList });
    this.setState({ wishes: newWishList, feedback: 'Du kjøpte eller solgte noe!' });
  }

  toggleShowSelected(e) {
    debug('toggleShowSelected', e);
    const { hideSelected } = this.state;

    e.preventDefault();
    this.setState({
      hideSelected: !hideSelected,
    });
  }

  render() {
    const {
      wishes, hideSelected, userState, feedback,
    } = this.state;
    const { match: { params } } = this.props;

    const filteredWishes = wishes.filter((el) => {
      debug('Wish to be filtered: ', el);
      return !el.checked || !hideSelected;
    }, this).map(wishInfo => (<OtherWish onClick={this.check} wishInfo={wishInfo} />),
      this);

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">
Ønskelisten til
            {' '}
            {userState}
          </h1>
          <Link className="grow button-navigation smallspace" to="/others">Tilbake</Link>
        </div>
        <hr />

        <h2>
Dette ønsker
          {' '}
          {userState}
          {' '}
seg
        </h2>
        <p>{feedback}</p>

        {filteredWishes}

        <Suggestions username={userState} userUid={params.name} />
        <hr />
        <Comments params={params} />
        <div className="flex-row space-between">
          <button type="button" className="other-wishlist__toggle-selected space button" onClick={this.toggleShowSelected}>
            {hideSelected
              ? 'Vis utkrysset' : 'Skjul utkrysset'}
          </button>
        </div>

      </Container>
    );
  }
}

OthersWishList.propTypes = {
  match: any,
  userlist: array,
  user: any,
};

export default connect(mapStateToProps, null)(OthersWishList);
