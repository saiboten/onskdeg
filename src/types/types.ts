export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface Wish {
  checked: boolean;
  id: string;
  name: string;
}

export interface FirebaseSnapshot {
  val: Function
}