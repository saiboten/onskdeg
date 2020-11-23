import firebase from "firebase";
// import "firebase/firestore";

// const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
require("firebase/functions");

var firebaseConfig = {
  apiKey: "AIzaSyDRCFzLXgaM36t-0Vnhp2XbbQJrUjDmQAw",
  authDomain: "auth.auth.xn--gavenske-84a.no",
  databaseURL: "https://onskdeg.firebaseio.com",
  projectId: "onskdeg",
  storageBucket: "onskdeg.appspot.com",
  messagingSenderId: "776764935060",
  appId: "1:776764935060:web:3b84bf79abfad4c62cdd81",
};
firebase.initializeApp(firebaseConfig);

if (location.hostname === "localhost") {
  firebase.firestore().useEmulator("localhost", 8080);
}

export default firebase;
