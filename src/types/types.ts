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
  checked: boolean;
  id: string;
  name: string;
  image: string;
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