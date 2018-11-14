import React from 'react';
import { connect } from 'react-redux';
import { any, func } from 'prop-types';
import styled from 'styled-components';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
// import Comments from './Comments';
// import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';
import { setWishesForUser } from '../../state/actions/wish';
import Icon from '../common/Icon';
import { User, Wish, Match } from '../../types/types';

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const debug = require('debug')('OthersWishList');

interface P {
  match: { params: { name: string }};
  update: (name: string, newWishList: Array<Wish>) => void;
  user: User;
  wishes: Array<Wish>;
}
interface S {
  hideSelected: boolean;
  userState: string;
  feedback: string;
}
class OthersWishList extends React.Component<P, S> {
  firebaseRef?: firebase.database.Reference;

  constructor(props: any) {
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
      update(name, snapshot && snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef && this.firebaseRef.off();
  }

  check(id: string) {
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
          image: e.image
        };
      }

      return e;
    });
    update(name, newWishList);
    // firebase.database().ref(`wishes/${name}`).set({ wishes: newWishList });
    this.setState({ feedback: 'Du kjøpte eller solgte noe!' });
  }

  toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    debug('toggleShowSelected', e);
    const { hideSelected } = this.state;

    e.preventDefault();
    this.setState({
      hideSelected: !hideSelected,
    });
  }

  shouldDisplayWish(el: Wish) {
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

    const filteredWishes = wishes.filter(this.shouldDisplayWish).map(wishInfo => (
      <OtherWish deleteSuggestion={() => null} canDelete={false} key={wishInfo.id} onClick={this.check} wishInfo={wishInfo} />));

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">
            {'Ønskelisten til '}
            {userState}
          </h1>
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

interface WishesDict {
  [key: string]: Wish
}

const OthersWishListWrapper = connect(
  ({ wishes, user, match: { params: { name } } }: { wishes: WishesDict, user: User, match: Match }) => (
    {
      wishes: wishes[name] || [],
      name,
      user,
    }
  ),
  dispatch => ({
    update(uid: string, newWishList: Array<Wish>) {
      dispatch(setWishesForUser({ uid, wishes: newWishList }));
    },
  }),
)(OthersWishList);

export default OthersWishListWrapper;
