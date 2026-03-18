import { render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import QueryProvider, { createAppQueryClient } from "../QueryProvider";

function QueryClientProbe({
  expectedClient,
}: {
  expectedClient?: ReturnType<typeof createAppQueryClient>;
}) {
  const queryClient = useQueryClient();

  return (
    <span>
      {expectedClient
        ? queryClient === expectedClient
          ? "same-client"
          : "different-client"
        : "created-client"}
    </span>
  );
}

describe("QueryProvider", () => {
  it("uses the provided query client", () => {
    const client = createAppQueryClient();

    render(
      <QueryProvider client={client}>
        <QueryClientProbe expectedClient={client} />
      </QueryProvider>,
    );

    expect(screen.getByText("same-client")).toBeInTheDocument();
  });

  it("creates a query client when one is not provided", () => {
    render(
      <QueryProvider>
        <QueryClientProbe />
      </QueryProvider>,
    );

    expect(screen.getByText("created-client")).toBeInTheDocument();
  });
});
