import { useWishes } from "./useWishes";

export function useWish(user: string, wishId: string) {
  const { wishes, isError, isLoading } = useWishes(user);
  const wish = wishes?.find((m) => m.id === wishId);
  return {
    wish,
    isLoading,
    isError,
  };
}
