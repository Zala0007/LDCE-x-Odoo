import { describe, expect, it } from "vitest";
import { digestResetToken } from "@/lib/services/password-reset-service";
import { hashPassword, verifyPassword } from "@/lib/services/password-service";

describe("password security", () => {
  it("hashes and verifies passwords without storing plaintext", async () => {
    const password = "Strongpass1";
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(await verifyPassword(password, hashed)).toBe(true);
    expect(await verifyPassword("Wrongpass1", hashed)).toBe(false);
  });

  it("produces deterministic non-plaintext reset token digests", () => {
    const token = "a-secure-random-token";
    expect(digestResetToken(token)).toBe(digestResetToken(token));
    expect(digestResetToken(token)).not.toContain(token);
  });
});
