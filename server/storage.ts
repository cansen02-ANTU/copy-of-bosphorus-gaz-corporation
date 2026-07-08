// Storage helpers with dual-mode support:
// 1. Manus Forge S3 (when BUILT_IN_FORGE_API_URL + BUILT_IN_FORGE_API_KEY are set)
// 2. Local filesystem fallback (saves to uploads/ directory, served as /uploads/*)

import { ENV } from "./_core/env";
import path from "path";
import fs from "fs";

// ─── Helpers ────────────────────────────────────────────────────────────────

function hasForgeConfig(): boolean {
  return !!(ENV.forgeApiUrl && ENV.forgeApiKey);
}

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

// ─── Local filesystem storage ───────────────────────────────────────────────

function getUploadsDir(): string {
  // Use UPLOADS_DIR env var if set (for persistent storage on platforms like Render)
  // Otherwise fall back to sensible defaults
  if (process.env.UPLOADS_DIR) {
    const dir = path.resolve(process.env.UPLOADS_DIR);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    const dir = path.resolve(process.cwd(), "client/public/uploads");
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
  // In production without UPLOADS_DIR, use dist/public/uploads (served by Express static)
  const dir = path.resolve(process.cwd(), "dist/public/uploads");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function localPut(
  relKey: string,
  data: Buffer | Uint8Array | string,
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const uploadsDir = getUploadsDir();
  
  // Flatten nested paths (e.g. "gallery/photo.jpg" → "gallery_photo_hash.jpg")
  const flatKey = key.replace(/\//g, "_");
  const filePath = path.join(uploadsDir, flatKey);

  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  fs.writeFileSync(filePath, buffer);

  return { key: flatKey, url: `/uploads/${flatKey}` };
}

// ─── Forge S3 storage ───────────────────────────────────────────────────────

async function forgePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));

  // 1. Get presigned PUT URL from Forge
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }

  const { url: s3Url } = (await presignResp.json()) as { url: string };
  if (!s3Url) throw new Error("Forge returned empty presign URL");

  // 2. PUT file directly to S3
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }

  return { key, url: `/images/${key}` };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  if (hasForgeConfig()) {
    return forgePut(relKey, data, contentType);
  }
  // Fallback: save to local filesystem
  return localPut(relKey, data);
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  if (hasForgeConfig()) {
    return { key, url: `/images/${key}` };
  }
  // For local storage, files are served from /uploads/
  return { key, url: `/uploads/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  if (!hasForgeConfig()) {
    // Local mode: just return the public URL
    const key = normalizeKey(relKey);
    return `/uploads/${key}`;
  }

  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = normalizeKey(relKey);

  const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
  getUrl.searchParams.set("path", key);

  const resp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => resp.statusText);
    throw new Error(`Storage signed URL failed (${resp.status}): ${msg}`);
  }

  const { url } = (await resp.json()) as { url: string };
  return url;
}
