import {
  fetchProduct,
  fetchProducts,
  PRODUCTS_PAGE_SIZE,
} from "../products.api";
import { fetchJson } from "../../utils/fetcher";
import {
  productFixture,
  productsPageFixture,
} from "../../test/fixtures/products";

vi.mock("../../utils/fetcher", () => ({
  fetchJson: vi.fn(),
}));

const mockedFetchJson = vi.mocked(fetchJson);

describe("products.api", () => {
  beforeEach(() => {
    mockedFetchJson.mockReset();
  });

  it("requests the default products endpoint", async () => {
    mockedFetchJson.mockResolvedValue(productsPageFixture);

    await expect(fetchProducts({})).resolves.toEqual(productsPageFixture);

    expect(mockedFetchJson).toHaveBeenCalledWith(
      `https://dummyjson.com/products?limit=${PRODUCTS_PAGE_SIZE}&skip=0`,
    );
  });

  it("requests the search endpoint with a trimmed query", async () => {
    mockedFetchJson.mockResolvedValue(productsPageFixture);

    await fetchProducts({
      pageParam: 24,
      search: "  air fryer  ",
    });

    expect(mockedFetchJson).toHaveBeenCalledWith(
      `https://dummyjson.com/products/search?limit=${PRODUCTS_PAGE_SIZE}&skip=24&q=air%20fryer`,
    );
  });

  it("requests a single product by id", async () => {
    mockedFetchJson.mockResolvedValue(productFixture);

    await expect(fetchProduct("42")).resolves.toEqual(productFixture);

    expect(mockedFetchJson).toHaveBeenCalledWith(
      "https://dummyjson.com/products/42",
    );
  });
});
