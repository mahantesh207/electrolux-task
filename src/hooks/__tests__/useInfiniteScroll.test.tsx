import { act, renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "../useInfiniteScroll";

describe("useInfiniteScroll", () => {
  it("does not call onIntersect when the observed entry is not intersecting", () => {
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();
    let observerCallback: IntersectionObserverCallback | undefined;

    class TestIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      disconnect = disconnectSpy;
      observe = observeSpy;
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }

    vi.stubGlobal(
      "IntersectionObserver",
      TestIntersectionObserver as unknown as typeof IntersectionObserver,
    );

    const onIntersect = vi.fn();
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll<HTMLDivElement>({ onIntersect }),
    );

    result.current(document.createElement("div"));

    act(() => {
      observerCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(observeSpy).toHaveBeenCalledTimes(1);
    expect(onIntersect).not.toHaveBeenCalled();

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("skips observation when disabled", () => {
    const observeSpy = vi.fn();

    class TestIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      disconnect = vi.fn();
      observe = observeSpy;
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();
    }

    vi.stubGlobal(
      "IntersectionObserver",
      TestIntersectionObserver as unknown as typeof IntersectionObserver,
    );

    const { result } = renderHook(() =>
      useInfiniteScroll<HTMLDivElement>({
        disabled: true,
        onIntersect: vi.fn(),
      }),
    );

    result.current(document.createElement("div"));
    result.current(null);

    expect(observeSpy).not.toHaveBeenCalled();
  });
});
