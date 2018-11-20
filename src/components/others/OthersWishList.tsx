import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
// import Comments from './Comments';
// import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';
import { setWishesForUser, storeWishesToFirebase } from '../../state/actions/wish';
import Icon from '../common/Icon';
import { User, Wish, Match } from '../../types/types';
import { ApplicationState } from '../../state/reducers';
import spinnerWhileLoading from '../common/spinnerWhileLoading';
import { loadFriends } from '../../state/actions/friends';

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const debug = require('debug')('OthersWishList');

interface Props {
  match: { params: { name: string }};
  setWishes: (name: string, newWishList: Array<Wish>) => void;
  storeWishes: (name: string, newWishList: Array<Wish>) => void;
  user: User;
  wishes: Array<Wish>;
  friend: User;
}
interface State {
  hideSelected: boolean;
  feedback: string;
}
class OthersWishList extends React.Component<Props, State> {
  firebaseRef?: firebase.database.Reference;

  constructor(props: any) {
    super(props);
    debug('constructor');
    this.state = {
      hideSelected: true, feedback: '',
    };
    this.check = this.check.bind(this);
    this.toggleShowSelected = this.toggleShowSelected.bind(this);
    this.shouldDisplayWish = this.shouldDisplayWish.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    const { match: { params: { name } }, setWishes } = this.props;

    this.firebaseRef = firebase.database().ref(`wishes/${name}/wishes`);

    this.firebaseRef.on('value', (snapshot) => {
      setWishes(name, snapshot && snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef && this.firebaseRef.off();
  }

  check(id: string) {
    debug('check', id);
    const { user, match: { params: { name } } } = this.props;
    const { wishes, storeWishes } = this.props;

    const newWishList = wishes.map((e) => {
      if (id === e.id) {
        console.log(e);
        return {
          name: e.name,
          checked: !e.checked,
          id: e.id,
          checkedby: user.email,
          checkedTime: new Date(),
          image: e.image || ''
        };
      }

      return e;
    });
    console.log(newWishList);
    storeWishes(name, newWishList);
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
      hideSelected, feedback,
    } = this.state;
    const { wishes, friend } = this.props;

    const filteredWishes = wishes.filter(this.shouldDisplayWish).map(wishInfo => (
      <OtherWish deleteSuggestion={() => null} canDelete={false} key={wishInfo.id} onClick={this.check} wishInfo={wishInfo} />));

    return (
      <Container>

        <div className="flex-row space-between">
          <h1 className="shrink overflow-hidden">
            {`Ønskelisten til ${friend.name}`}
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

const mapStateToProps = ({ wish, user, friends: { loading, loaded, friends } }: ApplicationState, { match: { params: { name } } }: any) => {
  const friendsFiltered = friends.filter(u => u.uid === name);

  return {
    wishes: wish[name] || [],
    user,
    loading,
    loaded,
    friend: friendsFiltered.length > 0 ? friendsFiltered.reduce(e => e) : {}
  }
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: () => dispatch(loadFriends()),
  setWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(setWishesForUser({ uid, wishes: newWishList }));
  },
  storeWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(storeWishesToFirebase(uid, newWishList));
  },
});

const WithSpinner = spinnerWhileLoading(({ loaded, loading, load }: { loaded: boolean, loading: boolean, load: () => void}) => {
  if (!loaded && !loading) {
    load();
  }
  return !loaded;
})(OthersWishList);

const OthersWishListWrapper = connect(mapStateToProps, mapDispatchToProps)(WithSpinner);

export default OthersWishListWrapper;
