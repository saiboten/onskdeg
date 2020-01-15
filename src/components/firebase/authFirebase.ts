import firebase from "./firebase";
import { userLoaded } from "../../state/actions/user";
import store from "../../store";
import { FirebaseSnapshot } from "../../types/types";

const obj = {
  authChangeListener() {
    firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user == null) {
        return;
      }
      const { uid, email } = user;
      if (user) {
        firebase
          .database()
          .ref(`users/${uid}/name`)
          .once("value", snapshot => {
            const name = snapshot.val();
            store.dispatch(userLoaded({ uid, email, name }));
          });
      } else {
        store.dispatch(userLoaded(null));
      }
    });
  }
};
export default obj;
