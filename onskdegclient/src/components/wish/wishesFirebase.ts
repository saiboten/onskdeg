import store from '../../store';
import { setAllWishes } from '../../state/actions/wish';
import firebase from '../firebase/firebase';

const obj = {
  setupWishesListener() {
    firebase.database().ref('wishes').on('value', (wishes) => {
      store.dispatch(setAllWishes(wishes.val()));
    });
  },
};

export default obj;
