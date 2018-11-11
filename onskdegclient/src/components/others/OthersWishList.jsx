import React from 'react';
import { connect } from 'react-redux';
import { any, func } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
// import Comments from './Comments';
// import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';
import { setWishesForUser } from '../../state/actions/wish';
import Icon from '../common/Icon';

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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
    this.shouldDisplayWish = this.shouldDisplayWish.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    const { match: { params: { name } }, update } = this.props;

    this.firebaseRef = firebase.database().ref(`wishes/${name}/wishes`);

    this.firebaseRef.on('value', (snapshot) => {
      update(name, snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  check(id) {
    debug('check', id);
    const { user, match: { params: { name } } } = this.props;
    const { wishes, update } = this.props;

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
    update(name, newWishList);
    // firebase.database().ref(`wishes/${name}`).set({ wishes: newWishList });
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

  shouldDisplayWish(el) {
    const {
      hideSelected,
    } = this.state;

    debug('Wish to be filtered: ', el);
    return !el.checked || !hideSelected;
  }

  render() {
    const {
      hideSelected, userState, feedback,
    } = this.state;
    const { wishes } = this.props;

    const filteredWishes = wishes.filter(this.shouldDisplayWish).map(wishInfo => (<OtherWish onClick={this.check} wishInfo={wishInfo} />));

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">
            {'Ønskelisten til '}
            {userState}
          </h1>
          <Link className="button-navigation smallspace" to="/others">Tilbake</Link>
        </div>
        <ActionButtonsContainer>
          <Icon type="button" name={hideSelected ? 'eye' : 'eye-off'} onClick={this.toggleShowSelected} />
        </ActionButtonsContainer>
        <p>{feedback}</p>

        {filteredWishes}

        {/* <Suggestions username={userState} userUid={params.name} />
        <hr />
        <Comments params={params} /> */}

      </Container>
    );
  }
}

OthersWishList.propTypes = {
  match: any,
  user: any,
  wishes: any,
  update: func.isRequired,
};


const OthersWishListWrapper = connect(
  ({ wish, user }, { match: { params: { name } } }) => (
    {
      wishes: wish[name] || [],
      name,
      user,
    }
  ),
  dispatch => ({
    update(uid, newWishList) {
      dispatch(setWishesForUser({ uid, wishes: newWishList }));
    },
  }),
)(OthersWishList);

export default OthersWishListWrapper;
