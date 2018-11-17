import { User } from "../../types/types";

export const setName = (name: string) => ({
  type: 'SET_NAME',
  name
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
