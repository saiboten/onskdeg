// @flow

import store from '../store';
import { setSuggestions } from './suggestionActions';
import firebase from '../firebase/firebase';

const debug = require('debug')('suggestionsFirebase');


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
