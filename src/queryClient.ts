import { QueryClient, QueryKey } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function invalidate(queryKey: QueryKey) {
  return queryClient.invalidateQueries({ queryKey });
}
