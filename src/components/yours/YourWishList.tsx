import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Wish from '../wish/Wish';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';

import { setWishes, storeOwnWishesToFirebase } from '../../state/actions/wish';
import { Wish as WishType, User, FirebaseSnapshot } from '../../types/types';
import Container from '../common/container/Container';
import { BorderButton } from '../common/Button';
import { Link } from '../common/Link';

const StyledCheckIcon = styled(Icon)`
   position: absolute;
   color: black;
   top: 0;
   left: 15px;
   height: 100%;
   background-color: transparent;
   border: none;
   float: right;
   cursor: pointer;
`;

interface P {
  user: User;
  updateWishStore: (newWishes: Array<WishType>) => void;
  storeWishesToFirebase: (newWishes: Array<WishType>) => void;
  wishes: Array<WishType>;
}

interface S {
  newWish: string;
  feedback: string;
}

const StyledWrapper = styled.form`
  position: relative;
  margin-bottom: .8rem;
`;

const StyledInput = styled.input`
  height: 48px;
  padding: 0 10px;
  padding-left: 40px;
  width: calc(100% - 1.6rem);
  margin: 0 .8rem;
  border-radius: 10px;
  border: none;
  @media only screen and (min-width: 37.5em) {
    flex: 1 0 70%;
  }
`;

const StyledBottomOptions = styled.div`
    width: 100%;
    text-align: left;
    margin-top: 10px;
`;

class YourWishList extends React.Component<P,S> {

  firebaseRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      newWish: '',
      feedback: '',
    };

    this.addWish = this.addWish.bind(this);
    this.updateWishState = this.updateWishState.bind(this);
    this.update = this.update.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.addImage = this.addImage.bind(this);
  }

  componentDidMount() {
    const { user, updateWishStore } = this.props;

    this.firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

    this.firebaseRef.on('value', (snapshot: FirebaseSnapshot) => {
      updateWishStore(snapshot.val());
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  /*eslint-disable */
  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
  }
  /* eslint-enable */


  updateWishState(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newWish: e.target.value,
    });
  }

  addWish(e: React.FormEvent<HTMLFormElement>) {
    const { user, wishes, storeWishesToFirebase } = this.props;
    const { newWish } = this.state;

    e.preventDefault();

    if (newWish === '') {
      this.setState({
        feedback: 'Ønsket kan ikke være tomt',
      });
      return;
    }

    const newWishList = Object.assign([], wishes);
    newWishList.unshift({
      name: newWish,
      id: this.createGuid(),
      image: '',
      accomplished: false,
      accomplishedby: '',
      deleted: false,
      description: '',
      link: ''
    });

    storeWishesToFirebase(newWishList);

    this.setState({
      newWish: '',
      feedback: '',
    });
  }

  update(wish: WishType) {
    const { user, wishes, storeWishesToFirebase } = this.props;

    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image: wish.image ? wish.image : '',
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  addImage(wish: WishType, image: string) {
    const { wishes, storeWishesToFirebase } = this.props;
    const newWishList = wishes.map((e) => {
      if (e.id === wish.id) {
        return {
          name: wish.name,
          id: wish.id,
          image,
          ...wish
        };
      }
      return e;
    });
    storeWishesToFirebase(newWishList);
  }

  deleteThis(deleteId: string) {
    const { user, wishes, storeWishesToFirebase } = this.props;
    const newWishList = Object.assign([], wishes);

    const filteredNewWishList = newWishList.filter((e: WishType) => {
      return e.id !== deleteId;
    });

    storeWishesToFirebase(filteredNewWishList);
  }

  render() {
    const { wishes } = this.props;
    const { newWish, feedback } = this.state;

    const wishesEl = wishes.map((el: WishType) => {
      return (
        <Wish
          key={el.id}
          update={this.update}
          delete={this.deleteThis}
          addImage={this.addImage}
          wish={el}
        />);
    });

    return (
      <Container>
        <StyledWrapper onSubmit={this.addWish}>  
            <StyledInput
              type="text"
              placeholder="Legg inn nye ønsker her"
              value={newWish}
              onChange={this.updateWishState}
            />
            <StyledCheckIcon type="submit" name="check" onClick={() => null} />
            {feedback && <div>{feedback}</div>}
        </StyledWrapper>

        <div className="your-wishlist__wishlist">
          {wishesEl}
        </div>
        <StyledBottomOptions>
          <BorderButton><Link to={`/guardians`}>Konfigurer andre</Link></BorderButton>
        </StyledBottomOptions>
      </Container>
    );
  }
}

export default connect(
  ({ wish: { wishes }, user }: { wish: any, user: User}) => {
    return {
      wishes: wishes[user.uid] ? wishes[user.uid] : [],
      user,
    };
  },
  dispatch => ({
    updateWishStore: (newData: Array<WishType>) => {
      dispatch(setWishes(newData));
    },
    storeWishesToFirebase: (newData: Array<WishType>) => {
      dispatch(storeOwnWishesToFirebase(newData));
    },
  }),
)(YourWishList);
