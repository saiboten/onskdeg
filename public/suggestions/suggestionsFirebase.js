// @flow
var debug = require('debug')('userlistListener');

import store from '../store';
import {setSuggestions} from './suggestionActions';
import firebase from '../firebase/firebase';

let obj = {
  setupSuggestionListener() {
    firebase.database().ref('suggestion').on('value',(suggestions) => {
      store.dispatch(setSuggestions(suggestions.val()));
    });
  },
  saveSuggestions(suggestions) {
    firebase.database().ref('suggestion').set(suggestions);
  }
};

module.exports = obj;
