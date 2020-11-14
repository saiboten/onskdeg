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
  email?: string;
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
  accomplished: boolean;
  accomplishedby: string; // The simplest approach, but not that flexible
}

export interface Purchases {
  [el: string]: Purchase;
}

export interface Purchase {
  checked: boolean;
  checkedby: string;
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
  groupName: string;
  admin: string;
  users: User[];
  invites: {
    email: string;
    name: string;
  }[];
}
