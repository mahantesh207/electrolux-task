import { fetchJson } from "../fetcher";

describe("fetchJson", () => {
  const mockedFetch = vi.fn();

  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("returns parsed JSON when the response is successful", async () => {
    const data = { ok: true };
    const json = vi.fn().mockResolvedValue(data);

    mockedFetch.mockResolvedValue({
      json,
      ok: true,
    } as unknown as Response);

    await expect(fetchJson<typeof data>("/api/products")).resolves.toEqual(data);
    expect(mockedFetch).toHaveBeenCalledWith("/api/products");
    expect(json).toHaveBeenCalledTimes(1);
  });

  it("throws an error when the response is not successful", async () => {
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 503,
    } as unknown as Response);

    await expect(fetchJson("/api/products")).rejects.toThrow(
      "Request failed with status 503",
    );
  });
});
