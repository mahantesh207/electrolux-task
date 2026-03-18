import type { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import QueryProvider, { createAppQueryClient } from "../../providers/QueryProvider";
import { fetchProduct } from "../../api/products.api";
import { productFixture } from "../../test/fixtures/products";
import { useProduct } from "../useProduct";

vi.mock("../../api/products.api", () => ({
  fetchProduct: vi.fn(),
}));

const mockedFetchProduct = vi.mocked(fetchProduct);

const createWrapper = () => {
  const client = createAppQueryClient();

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryProvider client={client}>{children}</QueryProvider>;
  };
};

describe("useProduct", () => {
  beforeEach(() => {
    mockedFetchProduct.mockReset();
  });

  it("fetches a product when an id is provided", async () => {
    mockedFetchProduct.mockResolvedValue(productFixture);

    const { result } = renderHook(() => useProduct("42"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedFetchProduct).toHaveBeenCalledWith("42");
    expect(result.current.data).toEqual(productFixture);
  });

  it("does not fetch when the id is empty", async () => {
    const { result } = renderHook(() => useProduct(""), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(result.current.isFetching).toBe(false);
    expect(mockedFetchProduct).not.toHaveBeenCalled();
  });
});
