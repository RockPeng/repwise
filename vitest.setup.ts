import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetStore } from "./lib/store";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetStore();
});
