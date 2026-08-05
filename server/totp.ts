import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const ISSUER = "Bosphorus Gaz Admin";
const ALGORITHM = "SHA1";
const DIGITS = 6;
const PERIOD = 30;

/**
 * Generate a new TOTP secret (base32 encoded).
 */
export function generateTotpSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

/**
 * Create a TOTP instance from a base32 secret.
 */
function createTotp(secret: string, label: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

/**
 * Generate a QR code data URL for Google Authenticator setup.
 * Returns a base64-encoded PNG data URL.
 */
export async function generateTotpQrCode(
  secret: string,
  accountLabel: string
): Promise<string> {
  const totp = createTotp(secret, accountLabel);
  const uri = totp.toString();
  const dataUrl = await QRCode.toDataURL(uri, {
    width: 256,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return dataUrl;
}

/**
 * Verify a TOTP token against a secret.
 * Allows a window of ±1 period (30s) to account for clock drift.
 * Returns true if valid.
 */
export function verifyTotpToken(secret: string, token: string): boolean {
  const totp = createTotp(secret, "verify");
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

/**
 * Get the otpauth:// URI for manual entry (if QR code can't be scanned).
 */
export function getTotpUri(secret: string, accountLabel: string): string {
  const totp = createTotp(secret, accountLabel);
  return totp.toString();
}
