import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

  it("accepts login with valid credentials and sets cookie", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      username: process.env.ADMIN_USERNAME!,
      password: process.env.ADMIN_PASSWORD!,
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe("admin_session");
    expect(setCookies[0]?.value).toBeTruthy(); // JWT token
    expect(setCookies[0]?.options.httpOnly).toBe(true);
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
    expect(clearedCookies[0]?.options.sameSite).toBe("lax");
  });
});

describe("adminAuth.me", () => {
  it("returns null when no admin user in context", async () => {
    const { ctx } = createMockContext(null);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.me();
    expect(result).toBeNull();
  });

  it("returns null when user is not admin-local", async () => {
    const { ctx } = createMockContext({
      id: 1,
      openId: "regular-user",
      name: "Regular User",
      email: "user@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });
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
