import { getApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/storage";

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

// App Check is required by Firebase AI Logic. In dev, the SDK logs a debug
// token to the console that must be added under App Check > Manage debug tokens.
if (import.meta.env.DEV) {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
initializeAppCheck(getApp(), {
  provider: new ReCaptchaEnterpriseProvider(
    "6LcS4_QtAAAAABET9KpImrtPeLWpeIbeLyTymKou"
  ),
  isTokenAutoRefreshEnabled: true,
});

// if (location.hostname === "localhost") {
//   firebase.firestore().useEmulator("localhost", 8081);
// }

export default firebase;
