import firebase from "firebase";
// import "firebase/firestore";

// const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDRCFzLXgaM36t-0Vnhp2XbbQJrUjDmQAw",
  authDomain: "onskdeg.firebaseapp.com",
  databaseURL: "https://onskdeg.firebaseio.com",
  projectId: "onskdeg",
  storageBucket: "onskdeg.appspot.com",
  messagingSenderId: "776764935060",
  appId: "1:776764935060:web:3b84bf79abfad4c62cdd81"
};
firebase.initializeApp(firebaseConfig);

export default firebase;
