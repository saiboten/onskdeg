import store from '../store';
import {setSuggestions} from './suggestionActions';
var firebase = require('../firebase/firebase');
var debug = require('debug')('userlistListener');

var obj = {
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
