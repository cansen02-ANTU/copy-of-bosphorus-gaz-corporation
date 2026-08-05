import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock db module to avoid hitting real database
vi.mock("./db", () => ({
  getNewsArticles: vi.fn().mockResolvedValue([]),
  getNewsArticleById: vi.fn().mockResolvedValue(undefined),
  createNewsArticle: vi.fn().mockResolvedValue({ id: 1 }),
  updateNewsArticle: vi.fn().mockResolvedValue(undefined),
  deleteNewsArticle: vi.fn().mockResolvedValue(undefined),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  createGalleryImage: vi.fn().mockResolvedValue({ id: 1 }),
  updateGalleryImage: vi.fn().mockResolvedValue(undefined),
  deleteGalleryImage: vi.fn().mockResolvedValue(undefined),
  getGalleryAlbumsWithPhotos: vi.fn().mockResolvedValue([]),
  createGalleryAlbum: vi.fn().mockResolvedValue({ id: 1 }),
  updateGalleryAlbum: vi.fn().mockResolvedValue(undefined),
  deleteGalleryAlbum: vi.fn().mockResolvedValue(undefined),
  createGalleryPhoto: vi.fn().mockResolvedValue({ id: 1 }),
  updateGalleryPhoto: vi.fn().mockResolvedValue(undefined),
  deleteGalleryPhoto: vi.fn().mockResolvedValue(undefined),
  createGasRequest: vi.fn().mockResolvedValue({ id: 1 }),
  createContactMessage: vi.fn().mockResolvedValue({ id: 1 }),
  getContactMessages: vi.fn().mockResolvedValue([]),
  getGasRequests: vi.fn().mockResolvedValue([]),
  deleteContactMessage: vi.fn().mockResolvedValue(undefined),
  deleteGasRequest: vi.fn().mockResolvedValue(undefined),
  getAdminSetting: vi.fn().mockResolvedValue(null),
  setAdminSetting: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "k", url: "/u" }),
}));

vi.mock("./email", () => ({
  sendNotificationEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock("./totp", () => ({
  generateTotpSecret: vi.fn().mockReturnValue("JBSWY3DPEHPK3PXP"),
  generateTotpQrCode: vi.fn().mockResolvedValue("data:image/png;base64,fake"),
  verifyTotpToken: vi.fn().mockReturnValue(true),
}));

import { appRouter } from "./routers";
import { getAdminSetting } from "./db";
import { verifyTotpToken } from "./totp";

type CookieCall = {
  name: string;
  value?: string;
  options: Record<string, unknown>;
};

function createMockContext(user: TrpcContext["user"] = null): {
  ctx: TrpcContext;
  setCookies: CookieCall[];
  clearedCookies: CookieCall[];
} {
  const setCookies: CookieCall[] = [];
  const clearedCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as unknown as TrpcContext["res"],
  };

  return { ctx, setCookies, clearedCookies };
}

describe("Admin credentials environment variables", () => {
  it("ADMIN_USERNAME is set and non-empty", () => {
    const username = process.env.ADMIN_USERNAME;
    expect(username).toBeDefined();
    expect(username!.length).toBeGreaterThan(0);
  });

  it("ADMIN_PASSWORD is set and non-empty", () => {
    const password = process.env.ADMIN_PASSWORD;
    expect(password).toBeDefined();
    expect(password!.length).toBeGreaterThan(0);
  });

  it("ADMIN_PASSWORD meets minimum security requirements (8+ chars)", () => {
    const password = process.env.ADMIN_PASSWORD!;
    expect(password.length).toBeGreaterThanOrEqual(8);
  });
});

describe("adminAuth.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects login with invalid credentials", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      username: "wrong",
      password: "wrong",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns requiresSetup when 2FA is not configured", async () => {
    (getAdminSetting as any).mockResolvedValue(null);
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      username: process.env.ADMIN_USERNAME!,
      password: process.env.ADMIN_PASSWORD!,
    });

    expect(result.success).toBe(true);
    expect(result.requiresSetup).toBe(true);
    expect(result.requires2fa).toBe(false);
    expect((result as any).qrCode).toBeTruthy();
    expect((result as any).secret).toBeTruthy();
  });

  it("returns requires2fa when 2FA is already configured", async () => {
    (getAdminSetting as any).mockResolvedValue("EXISTING_SECRET_BASE32AA");
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      username: process.env.ADMIN_USERNAME!,
      password: process.env.ADMIN_PASSWORD!,
    });

    expect(result.success).toBe(true);
    expect(result.requires2fa).toBe(true);
    expect(result.requiresSetup).toBe(false);
  });
});

describe("adminAuth.verify2fa", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("issues session cookie on valid TOTP code", async () => {
    (getAdminSetting as any).mockResolvedValue("VALID_SECRET_BASE32AAAA");
    (verifyTotpToken as any).mockReturnValue(true);
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.verify2fa({
      username: process.env.ADMIN_USERNAME!,
      password: process.env.ADMIN_PASSWORD!,
      totpCode: "123456",
    });

    expect(result.success).toBe(true);
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe("admin_session");
    expect(setCookies[0]?.options.httpOnly).toBe(true);
  });

  it("rejects invalid TOTP code", async () => {
    (getAdminSetting as any).mockResolvedValue("VALID_SECRET_BASE32AAAA");
    (verifyTotpToken as any).mockReturnValue(false);
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.verify2fa({
      username: process.env.ADMIN_USERNAME!,
      password: process.env.ADMIN_PASSWORD!,
      totpCode: "000000",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Geçersiz");
    expect(setCookies).toHaveLength(0);
  });

  it("rejects if credentials are wrong even with valid TOTP", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.verify2fa({
      username: "wrong",
      password: "wrong",
      totpCode: "123456",
    });

    expect(result.success).toBe(false);
  });
});

describe("adminAuth.logout", () => {
  it("clears the admin session cookie", async () => {
    const { ctx, clearedCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.logout();

    expect(result.success).toBe(true);
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe("admin_session");
  });
});

describe("adminAuth.me", () => {
  it("returns null when no admin user in context", async () => {
    const { ctx } = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminAuth.me();
    expect(result).toBeNull();
  });

  it("returns admin info when admin-local user in context", async () => {
    const { ctx } = createMockContext({
      id: -1,
      openId: "admin-local",
      name: "admin",
      email: null,
      loginMethod: "password",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminAuth.me();
    expect(result).toEqual({ username: "admin", role: "admin" });
  });
});
