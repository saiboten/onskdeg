
import store from '../../store';
import { setSuggestions } from '../../state/actions/suggestion';
import firebase from '../firebase/firebase';

const obj = {
  setupSuggestionListener() {
    firebase.database().ref('suggestion').on('value', (suggestions) => {
      store.dispatch(setSuggestions(suggestions.val()));
    });
  },
  saveSuggestions(suggestions /* : Object */) {
    firebase.database().ref('suggestion').set(suggestions);
  },
};

export default obj;
