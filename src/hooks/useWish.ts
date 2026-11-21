import { useWishes } from "./useWishes";

export function useWish(user: string, wishId: string) {
  // Look in all wishes so archived ones still open (e.g. from purchases).
  const { allWishes, isError, isLoading } = useWishes(user);
  const wish = allWishes?.find((m) => m.id === wishId);
  return {
    wish,
    isLoading,
    isError,
  };
}
