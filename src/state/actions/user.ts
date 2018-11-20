import { User } from "../../types/types";

export const setNameAndEmail = (name: string, email?: string) => ({
  type: 'SET_NAME_AND_EMAIL',
  name,
  email
});

export const userLoaded = (user: User | null) => (
  {
    type: 'USER_LOADED',
    user,
  }
);

export const logout = () => (
  {
    type: 'LOG_OUT',
  }
);
