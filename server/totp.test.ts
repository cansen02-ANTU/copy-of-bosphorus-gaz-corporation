import { describe, it, expect } from "vitest";
import { generateTotpSecret, generateTotpQrCode, verifyTotpToken, getTotpUri } from "./totp";
import * as OTPAuth from "otpauth";

describe("TOTP 2FA helpers", () => {
  it("generateTotpSecret returns a valid base32 string", () => {
    const secret = generateTotpSecret();
    expect(secret).toBeTruthy();
    expect(secret.length).toBeGreaterThanOrEqual(16);
    // Base32 characters only
    expect(/^[A-Z2-7]+=*$/.test(secret)).toBe(true);
  });

  it("generateTotpQrCode returns a data URL PNG", async () => {
    const secret = generateTotpSecret();
    const qr = await generateTotpQrCode(secret, "testuser");
    expect(qr).toMatch(/^data:image\/png;base64,/);
  });

  it("verifyTotpToken validates a correct token", () => {
    const secret = generateTotpSecret();
    // Generate a valid token using the same library
    const totp = new OTPAuth.TOTP({
      issuer: "Bosphorus Gaz Admin",
      label: "test",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });
    const validToken = totp.generate();
    expect(verifyTotpToken(secret, validToken)).toBe(true);
  });

  it("verifyTotpToken rejects an invalid token", () => {
    const secret = generateTotpSecret();
    expect(verifyTotpToken(secret, "000000")).toBe(false);
    expect(verifyTotpToken(secret, "123456")).toBe(false);
  });

  it("getTotpUri returns a valid otpauth:// URI", () => {
    const secret = generateTotpSecret();
    const uri = getTotpUri(secret, "admin");
    expect(uri).toMatch(/^otpauth:\/\/totp\//);
    expect(uri).toContain("secret=");
    expect(uri).toContain("issuer=Bosphorus");
  });
});
