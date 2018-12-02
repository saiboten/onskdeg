declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}

export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface Wish {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
  deleted: boolean;
  accomplished: boolean;
  accompllishedby: string; // The simplest approach, but not that flexible
}

export interface Purchases {
  [el: string]: Purchase
}

export interface Purchase {
  checked: boolean;
  checkedby: string;
}

export interface FirebaseSnapshot {
  val: Function
}

export interface NameParam {
  name: ''
}

export interface Match {
  params: NameParam
}