import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
function queryErrorHandler(error: unknown) {
  const message = error instanceof Error ? error.message : "Error connecting to server";
  toast.error(message);
}
export function generateQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
}
export const queryClient = generateQueryClient();
