import firebase from "../components/firebase/firebase";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export interface Child extends User {
  parent: string[];
}

export interface User {
  uid: string;
  name?: string;
  childs?: string[];
  groups: string[];
  isChild: boolean;
}

export interface Wish {
  id: string;
  name: string;
  image?: string;
  description: string;
  link: string;
  deleted: boolean;
  isSuggestion: boolean;
  suggestedBy?: string;
  price?: number;
  date?: firebase.firestore.Timestamp;
}

export interface Purchases {
  [el: string]: Purchase;
}

export interface Purchase {
  checked: boolean;
  checkedBy?: string;
  wishId?: string;
  wishOwner?: string;
  date?: firebase.firestore.Timestamp;
}

export interface FirebaseSnapshot {
  val: Function;
}

export interface NameParam {
  name: "";
}

export interface Match {
  params: NameParam;
}

export interface Invites {
  myInvites: string[];
}

export type NewsEntryType = {
  user: string;
  suggestedBy?: string;
  wish?: string;
  isSuggestion: boolean;
  date: firebase.firestore.Timestamp;
};

export interface Kohort {
  id: string;
  groupName: string;
  admin: string;
  members: string[];
  invites: string[];
  newsFeed?: NewsEntryType[];
}
