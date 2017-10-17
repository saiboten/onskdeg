// @flow
const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyDRCFzLXgaM36t-0Vnhp2XbbQJrUjDmQAw',
  authDomain: 'onskdeg.firebaseapp.com',
  databaseURL: 'https://onskdeg.firebaseio.com',
  storageBucket: 'onskdeg.appspot.com',
  messagingSenderId: '776764935060',
};
firebase.initializeApp(config);
export default firebase;
