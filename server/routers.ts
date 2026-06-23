import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";
import {
  getNewsArticles,
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "./db";
import { storagePut } from "./storage";

const ADMIN_COOKIE_NAME = "admin_session";
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Admin Auth (username/password) ─────────────────────────────────────────
  adminAuth: router({
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        // Reject if credentials are not configured
        if (!ENV.adminUsername || !ENV.adminPassword) {
          return { success: false, error: "Admin kimlik bilgileri yapılandırılmamış" } as const;
        }

        if (input.username !== ENV.adminUsername || input.password !== ENV.adminPassword) {
          return { success: false, error: "Geçersiz kullanıcı adı veya şifre" } as const;
        }

        // Create a JWT token for the admin session
        const secret = new TextEncoder().encode(ENV.cookieSecret);
        const token = await new SignJWT({ username: input.username, role: "admin" })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .setExpirationTime(Math.floor((Date.now() + ONE_DAY_MS) / 1000))
          .sign(secret);

        ctx.res.cookie(ADMIN_COOKIE_NAME, token, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https",
          maxAge: ONE_DAY_MS,
        });

        return { success: true, error: null } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https",
      });
      return { success: true } as const;
    }),

    me: publicProcedure.query(({ ctx }) => {
      // Return the admin user if authenticated via admin cookie
      if (ctx.user && ctx.user.openId === "admin-local" && ctx.user.role === "admin") {
        return { username: ctx.user.name, role: "admin" };
      }
      return null;
    }),
  }),

  // ─── News Articles ─────────────────────────────────────────────────────────
  news: router({
    list: publicProcedure.query(async () => {
      return getNewsArticles();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getNewsArticleById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().optional(),
        imageBase64: z.string().optional(),
        imageMimeType: z.string().optional(),
        publishedAt: z.number(),
      }))
      .mutation(async ({ input }) => {
        let imageUrl: string | undefined;
        let imageKey: string | undefined;

        if (input.imageBase64 && input.imageMimeType) {
          const buffer = Buffer.from(input.imageBase64, "base64");
          const ext = input.imageMimeType.split("/")[1] || "jpg";
          const { key, url } = await storagePut(
            `news/image.${ext}`,
            buffer,
            input.imageMimeType
          );
          imageUrl = url;
          imageKey = key;
        }

        return createNewsArticle({
          title: input.title,
          excerpt: input.excerpt,
          content: input.content ?? null,
          imageUrl: imageUrl ?? null,
          imageKey: imageKey ?? null,
          publishedAt: input.publishedAt,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        excerpt: z.string().min(1).optional(),
        content: z.string().optional(),
        imageBase64: z.string().optional(),
        imageMimeType: z.string().optional(),
        publishedAt: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, imageBase64, imageMimeType, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };

        if (imageBase64 && imageMimeType) {
          const buffer = Buffer.from(imageBase64, "base64");
          const ext = imageMimeType.split("/")[1] || "jpg";
          const { key, url } = await storagePut(
            `news/image.${ext}`,
            buffer,
            imageMimeType
          );
          updateData.imageUrl = url;
          updateData.imageKey = key;
        }

        await updateNewsArticle(id, updateData as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteNewsArticle(input.id);
        return { success: true };
      }),
  }),

  // ─── Gallery Images ───────────────────────────────────────────────────────
  gallery: router({
    list: publicProcedure.query(async () => {
      return getGalleryImages();
    }),

    create: adminProcedure
      .input(z.object({
        caption: z.string().min(1),
        imageBase64: z.string(),
        imageMimeType: z.string(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.imageBase64, "base64");
        const ext = input.imageMimeType.split("/")[1] || "jpg";
        const { key, url } = await storagePut(
          `gallery/image.${ext}`,
          buffer,
          input.imageMimeType
        );

        return createGalleryImage({
          caption: input.caption,
          imageUrl: url,
          imageKey: key,
          sortOrder: input.sortOrder ?? 0,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        caption: z.string().min(1).optional(),
        sortOrder: z.number().optional(),
        imageBase64: z.string().optional(),
        imageMimeType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, imageBase64, imageMimeType, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };

        if (imageBase64 && imageMimeType) {
          const buffer = Buffer.from(imageBase64, "base64");
          const ext = imageMimeType.split("/")[1] || "jpg";
          const { key, url } = await storagePut(
            `gallery/image.${ext}`,
            buffer,
            imageMimeType
          );
          updateData.imageUrl = url;
          updateData.imageKey = key;
        }

        await updateGalleryImage(id, updateData as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGalleryImage(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
