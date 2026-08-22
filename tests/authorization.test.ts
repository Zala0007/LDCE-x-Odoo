import { describe, expect, it } from "vitest";
import { isTripOwner } from "@/lib/auth/authorization";

describe("trip ownership policy", () => {
  it("allows the owner", () => expect(isTripOwner("user-a", "user-a")).toBe(true));
  it("denies a different user", () => expect(isTripOwner("user-a", "user-b")).toBe(false));
});
