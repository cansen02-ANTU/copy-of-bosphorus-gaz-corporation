import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { parse as parseCookieHeader } from "cookie";
import { jwtVerify } from "jose";
import { ENV } from "./env";

const ADMIN_COOKIE_NAME = "admin_session";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function getAdminUserFromCookie(cookieHeader: string | undefined): Promise<User | null> {
  if (!cookieHeader) return null;
  const cookies = parseCookieHeader(cookieHeader);
  const adminToken = cookies[ADMIN_COOKIE_NAME];
  if (!adminToken) return null;

  try {
    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const { payload } = await jwtVerify(adminToken, secret, { algorithms: ["HS256"] });
    if (payload.role === "admin" && payload.username) {
      // Return a synthetic admin user object
      return {
        id: -1,
        openId: "admin-local",
        name: payload.username as string,
        email: null,
        loginMethod: "password",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    }
  } catch {
    // Invalid or expired token
  }
  return null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Check for standalone admin session cookie (username/password auth)
  user = await getAdminUserFromCookie(opts.req.headers.cookie);

  // If no admin cookie and Manus OAuth is configured, try OAuth for public user auth
  // When self-hosting without Manus OAuth, this block is safely skipped
  if (!user && ENV.oAuthServerUrl && ENV.appId) {
    try {
      const { sdk } = await import("./sdk");
      user = await sdk.authenticateRequest(opts.req);
    } catch {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
