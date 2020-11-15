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
  image: string;
  description: string;
  link: string;
  deleted: boolean;
  isSuggestion: boolean;
  suggestedBy?: string;
}

export interface Purchases {
  [el: string]: Purchase;
}

export interface Purchase {
  checked: boolean;
  checkedBy?: string;
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

export interface Kohort {
  id: string;
  groupName: string;
  admin: string;
  members: string[];
  invites: string[];
}
