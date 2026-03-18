import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

vi.stubGlobal(
  "IntersectionObserver",
  MockIntersectionObserver as unknown as typeof IntersectionObserver,
);
vi.stubGlobal("scrollTo", vi.fn());

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
