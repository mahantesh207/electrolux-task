import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates only after the debounce delay and clears stale timers", () => {
    const { result, rerender } = renderHook(
      ({ delay, value }) => useDebouncedValue(value, delay),
      {
        initialProps: {
          delay: 200,
          value: "first",
        },
      },
    );

    expect(result.current).toBe("first");

    rerender({
      delay: 200,
      value: "second",
    });

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(result.current).toBe("first");

    rerender({
      delay: 200,
      value: "third",
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("third");
  });
});
