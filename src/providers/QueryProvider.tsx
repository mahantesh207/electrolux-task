import { useState } from "react";
import type { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type QueryProviderProps = PropsWithChildren<{
  client?: QueryClient;
}>;

export default function QueryProvider({
  children,
  client,
}: QueryProviderProps) {
  const [queryClient] = useState(() => client ?? createAppQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
