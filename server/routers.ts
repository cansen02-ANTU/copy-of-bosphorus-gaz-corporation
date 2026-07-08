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
  getGalleryAlbumsWithPhotos,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  createGasRequest,
} from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

const CONTACT_EMAIL = "information@bosphorusgaz.com";

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

    albums: publicProcedure.query(async () => {
      return getGalleryAlbumsWithPhotos();
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

    // ─── Album Admin CRUD ───────────────────────────────────────────────────
    createAlbum: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        coverImageBase64: z.string().optional(),
        coverImageMimeType: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        let coverUrl: string | undefined;
        if (input.coverImageBase64 && input.coverImageMimeType) {
          const buffer = Buffer.from(input.coverImageBase64, "base64");
          const ext = input.coverImageMimeType.split("/")[1] || "jpg";
          const { url } = await storagePut(`gallery/cover.${ext}`, buffer, input.coverImageMimeType);
          coverUrl = url;
        }
        return createGalleryAlbum({
          slug: input.slug,
          title: input.title,
          description: input.description ?? null,
          coverUrl: coverUrl ?? null,
          sortOrder: input.sortOrder ?? 0,
        });
      }),

    updateAlbum: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImageBase64: z.string().optional(),
        coverImageMimeType: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, coverImageBase64, coverImageMimeType, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (coverImageBase64 && coverImageMimeType) {
          const buffer = Buffer.from(coverImageBase64, "base64");
          const ext = coverImageMimeType.split("/")[1] || "jpg";
          const { url } = await storagePut(`gallery/cover.${ext}`, buffer, coverImageMimeType);
          updateData.coverUrl = url;
        }
        await updateGalleryAlbum(id, updateData as any);
        return { success: true };
      }),

    deleteAlbum: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGalleryAlbum(input.id);
        return { success: true };
      }),

    // ─── Photo Admin CRUD ───────────────────────────────────────────────────
    addPhoto: adminProcedure
      .input(z.object({
        albumId: z.number(),
        imageBase64: z.string(),
        imageMimeType: z.string(),
        caption: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.imageBase64, "base64");
        const ext = input.imageMimeType.split("/")[1] || "jpg";
        const { key, url } = await storagePut(`gallery/photo.${ext}`, buffer, input.imageMimeType);
        return createGalleryPhoto({
          albumId: input.albumId,
          imageUrl: url,
          imageKey: key,
          caption: input.caption ?? null,
          sortOrder: input.sortOrder ?? 0,
        });
      }),

    updatePhoto: adminProcedure
      .input(z.object({
        id: z.number(),
        caption: z.string().optional(),
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
          const { key, url } = await storagePut(`gallery/photo.${ext}`, buffer, imageMimeType);
          updateData.imageUrl = url;
          updateData.imageKey = key;
        }
        await updateGalleryPhoto(id, updateData as any);
        return { success: true };
      }),

    deletePhoto: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGalleryPhoto(input.id);
        return { success: true };
      }),
  }),

  // ─── Gas Supply Request Form (Doğal Gaz Bilgi Formu) ──────────────────────
  gasRequest: router({
    submit: publicProcedure
      .input(z.object({
        companyName: z.string().min(1).max(500),
        contactPerson: z.string().min(1).max(300),
        email: z.string().email().max(320),
        phone: z.string().min(1).max(100),
        facilityAddress: z.string().min(1),
        facilityProvince: z.string().min(1).max(200),
        annualConsumption: z.string().min(1).max(50),
        usagePurpose: z.string().max(50).optional(),
        monthlyUsage: z.string().optional(),
        personnelName: z.string().max(300).optional(),
        personnelPosition: z.string().max(300).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Persist the request
        const { id } = await createGasRequest({
          companyName: input.companyName,
          contactPerson: input.contactPerson,
          email: input.email,
          phone: input.phone,
          facilityAddress: input.facilityAddress,
          facilityProvince: input.facilityProvince,
          annualConsumption: input.annualConsumption,
          usagePurpose: input.usagePurpose ?? null,
          monthlyUsage: input.monthlyUsage ?? null,
          personnelName: input.personnelName ?? null,
          personnelPosition: input.personnelPosition ?? null,
          notes: input.notes ?? null,
        });

        // Notify the owner (best-effort; do not fail the submission if it errors)
        const lines = [
          `Yeni Doğal Gaz Bilgi Formu talebi alındı (#${id}).`,
          ``,
          `Firma: ${input.companyName}`,
          `İletişim Kişisi: ${input.contactPerson}`,
          `E-posta: ${input.email}`,
          `Telefon: ${input.phone}`,
          `Tesis Adresi: ${input.facilityAddress}`,
          `Tesis İli: ${input.facilityProvince}`,
          `Yıllık Tüketim: ${input.annualConsumption}`,
          input.usagePurpose ? `Kullanım Amacı: ${input.usagePurpose}` : null,
          input.personnelName ? `İlgili Personel: ${input.personnelName}${input.personnelPosition ? ` (${input.personnelPosition})` : ""}` : null,
          input.monthlyUsage ? `Aylık Tüketim: ${input.monthlyUsage}` : null,
          input.notes ? `Ek Notlar: ${input.notes}` : null,
          ``,
          `Bu talep ${CONTACT_EMAIL} adresine iletilmek üzere kaydedilmiştir.`,
        ].filter((l): l is string => l !== null);

        try {
          await notifyOwner({
            title: `Yeni Talep: ${input.companyName}`,
            content: lines.join("\n"),
          });
        } catch (err) {
          console.warn("[gasRequest] notifyOwner failed:", err);
        }

        return { success: true, id } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
