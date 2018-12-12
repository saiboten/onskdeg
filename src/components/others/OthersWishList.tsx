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
import { setPurchasesForUser, purchaseItem as purchaseItemAction, sellItem as sellItemAction } from '../../state/actions/purchase';
import Icon from '../common/Icon';
import { User, Wish, Purchases } from '../../types/types';
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
  setPurchases: (name: string, purchasesForUser: Purchases) => void;
  storeWishes: (name: string, newWishList: Array<Wish>) => void;
  purchaseItem: (uid: string, itemid: string) => void;
  sellItem: (uid: string, itemid: string) => void;
  user: User;
  wishes: Array<Wish>;
  friend: User;
  purchases: Purchases;
  name: string;
}
interface State {
  hideSelected: boolean;
  feedback: string;
}
class OthersWishList extends React.Component<Props, State> {
  wishRef?: firebase.database.Reference;
  purchaseRef?: firebase.database.Reference;

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
    const { match: { params: { name } }, setWishes, setPurchases } = this.props;

    this.wishRef = firebase.database().ref(`wishes/${name}/wishes`);
    this.purchaseRef = firebase.database().ref(`purchases/${name}`);

    this.wishRef.on('value', (snapshot) => {
      setWishes(name, snapshot && snapshot.val());
    });

    this.purchaseRef.on('value', (snapshot) => {
      setPurchases(name, snapshot && snapshot.val());
    });

  }

  componentWillUnmount() {
    this.wishRef && this.wishRef.off();
  }

  check(id: string) {
    const { purchases, purchaseItem, sellItem, match: { params: { name } } } = this.props;
    if(purchases[id] && purchases[id].checked) {
      sellItem(name, id);
      this.setState({ feedback: 'Solgt!' });
    }
    else {
      purchaseItem(name, id);
      this.setState({ feedback: 'Kjøpt!' });
    }
    
    
  }

  toggleShowSelected(e: React.MouseEvent<HTMLElement>) {
    debug('toggleShowSelected', e);
    const { hideSelected } = this.state;

    e.preventDefault();
    this.setState({
      hideSelected: !hideSelected,
    });
  }

  shouldDisplayWish(el: Wish, purchases: Purchases) {
    const {
      hideSelected,
    } = this.state;

    debug('Wish to be filtered: ', el);
    return !(purchases[el.id] && purchases[el.id].checked) || !hideSelected;
  }

  render() {
    const {
      hideSelected, feedback,
    } = this.state;
    const { wishes, friend, purchases, name } = this.props;

    const filteredWishes = wishes.filter((el) => this.shouldDisplayWish(el, purchases)).map(wishInfo => (
      <OtherWish deleteSuggestion={() => null} user={name} canDelete={false} key={wishInfo.id} onClick={this.check} wishInfo={wishInfo} purchase={purchases[wishInfo.id] ? purchases[wishInfo.id] : { checked: false, checkedby: '' }} />));

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
      </Container>
    );
  } 
}

const mapStateToProps = ({ purchase, wish, user, friends: { loading, loaded, friends } }: ApplicationState, { match: { params: { name } } }: any) => {
  const friendsFiltered = friends.filter(u => u.uid === name);

  return {
    wishes: wish.wishes[name] || [],
    purchases: purchase.purchases[name] || {},
    name,
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
  setPurchases(uid: string, purchases: Purchases) {
    dispatch(setPurchasesForUser({uid, purchases}))
  },
  storeWishes(uid: string, newWishList: Array<Wish>) {
    dispatch(storeWishesToFirebase(uid, newWishList));
  },
  purchaseItem(uid: string, itemid: string) {
    dispatch(purchaseItemAction(uid, itemid));
  },
  sellItem(uid: string, itemid: string) {
    dispatch(sellItemAction(uid, itemid));
  }
});

const WithSpinner = spinnerWhileLoading(({ loaded, loading, load }: { loaded: boolean, loading: boolean, load: () => void}) => {
  if (!loaded && !loading) {
    load();
  }
  return !loaded;
})(OthersWishList);

const OthersWishListWrapper = connect(mapStateToProps, mapDispatchToProps)(WithSpinner);

export default OthersWishListWrapper;
