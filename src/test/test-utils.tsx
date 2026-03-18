import type { PropsWithChildren, ReactElement } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import QueryProvider, { createAppQueryClient } from "../providers/QueryProvider";
import {
  createAppStore,
  type AppStore,
  type RootState,
} from "../store/store";

type RenderWithProvidersOptions = {
  preloadedState?: Partial<RootState>;
  queryClient?: QueryClient;
  route?: string;
  store?: AppStore;
  withRouter?: boolean;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    queryClient = createAppQueryClient(),
    route = "/",
    store = createAppStore(preloadedState),
    withRouter = false,
  }: RenderWithProvidersOptions = {},
) => {
  function Wrapper({ children }: PropsWithChildren) {
    const content = withRouter ? (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ) : (
      children
    );

    return (
      <Provider store={store}>
        <QueryProvider client={queryClient}>{content}</QueryProvider>
      </Provider>
    );
  }

  return {
    queryClient,
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper }),
  };
};
