import React from 'react';
import { connect } from 'react-redux';
import { any } from 'prop-types';
import { Link } from 'react-router-dom';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import Comments from './Comments';
import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';

const debug = require('debug')('OthersWishList');

class OthersWishList extends React.Component {
  constructor(props) {
    super(props);
    debug('constructor');
    this.state = {
      hideSelected: true, userState: '', feedback: '',
    };
    this.check = this.check.bind(this);
    this.toggleShowSelected = this.toggleShowSelected.bind(this);
  }

  check(id) {
    debug('check', id);
    const { user, match: { params: { name } } } = this.props;
    const { wishes } = this.props;

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
    this.setState({ feedback: 'Du kjøpte eller solgte noe!' });
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
      hideSelected, userState, feedback,
    } = this.state;
    const { wishes, match: { params } } = this.props;

    const filteredWishes = wishes.filter((el) => {
      debug('Wish to be filtered: ', el);
      return !el.checked || !hideSelected;
    }, this).map(wishInfo => (<OtherWish onClick={this.check} wishInfo={wishInfo} />),
      this);

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">
            {'Ønskelisten til '}
            {userState}
          </h1>
          <Link className="button-navigation smallspace" to="/others">Tilbake</Link>
        </div>
        <hr />

        <h2>
          {'Dette ønsker '}
          {userState}
          {' seg'}
        </h2>
        <p>{feedback}</p>

        {filteredWishes}

        <Suggestions username={userState} userUid={params.name} />
        <hr />
        <Comments params={params} />
        <div className="flex-row space-between">
          <button type="button" className="other-wishlist__toggle-selected space button button--padded" onClick={this.toggleShowSelected}>
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
  user: any,
  wishes: any,
};


const OthersWishListWrapper = connect(
  ({ wish }, { match: { params: { name } } }) => (
    {
      wishes: wish[name].wishes,
      name,
    }
  ),
  undefined,
)(OthersWishList);

export default OthersWishListWrapper;
