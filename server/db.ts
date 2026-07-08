import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, newsArticles, galleryImages, InsertNewsArticle, InsertGalleryImage, galleryAlbums, galleryPhotos, gasRequests, InsertGasRequest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { ssl: 'require' });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── News Articles ───────────────────────────────────────────────────────────

export async function getNewsArticles(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}

export async function getNewsArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  return result[0];
}

export async function createNewsArticle(data: InsertNewsArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsArticles).values(data).returning({ id: newsArticles.id });
  return { id: result[0].id };
}

export async function updateNewsArticle(id: number, data: Partial<InsertNewsArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(newsArticles).set(data).where(eq(newsArticles.id, id));
}

export async function deleteNewsArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
}

// ─── Gallery Images ─────────────────────────────────────────────────────────

export async function getGalleryImages(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryImages).orderBy(desc(galleryImages.sortOrder)).limit(limit);
}

export async function createGalleryImage(data: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryImages).values(data).returning({ id: galleryImages.id });
  return { id: result[0].id };
}

export async function updateGalleryImage(id: number, data: Partial<InsertGalleryImage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

// ─── Gallery Albums & Photos ─────────────────────────────────────────────────

export async function getGalleryAlbums() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryAlbums).orderBy(galleryAlbums.sortOrder);
}

export async function getGalleryAlbumsWithPhotos() {
  const db = await getDb();
  if (!db) return [];
  const albums = await db.select().from(galleryAlbums).orderBy(galleryAlbums.sortOrder);
  const photos = await db.select().from(galleryPhotos).orderBy(galleryPhotos.sortOrder);
  return albums.map((album) => ({
    ...album,
    photos: photos
      .filter((p) => p.albumId === album.id)
      .map((p) => ({ id: p.id, imageUrl: p.imageUrl, caption: p.caption })),
  }));
}

// ─── Gallery Albums Admin CRUD ───────────────────────────────────────────────

export async function createGalleryAlbum(data: { slug: string; title: string; description?: string | null; coverUrl?: string | null; sortOrder?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryAlbums).values({
    slug: data.slug,
    title: data.title,
    description: data.description ?? null,
    coverUrl: data.coverUrl ?? null,
    sortOrder: data.sortOrder ?? 0,
  }).returning({ id: galleryAlbums.id });
  return { id: result[0].id };
}

export async function updateGalleryAlbum(id: number, data: Partial<{ title: string; description: string | null; coverUrl: string | null; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(galleryAlbums).set(data).where(eq(galleryAlbums.id, id));
}

export async function deleteGalleryAlbum(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete all photos in the album first
  await db.delete(galleryPhotos).where(eq(galleryPhotos.albumId, id));
  await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));
}

export async function createGalleryPhoto(data: { albumId: number; imageUrl: string; imageKey?: string | null; caption?: string | null; sortOrder?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryPhotos).values({
    albumId: data.albumId,
    imageUrl: data.imageUrl,
    imageKey: data.imageKey ?? null,
    caption: data.caption ?? null,
    sortOrder: data.sortOrder ?? 0,
  }).returning({ id: galleryPhotos.id });
  return { id: result[0].id };
}

export async function updateGalleryPhoto(id: number, data: Partial<{ imageUrl: string; imageKey: string | null; caption: string | null; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(galleryPhotos).set(data).where(eq(galleryPhotos.id, id));
}

export async function deleteGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

// ─── Gas Requests ──────────────────────────────────────────────

export async function createGasRequest(data: InsertGasRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(gasRequests).values(data).returning({ id: gasRequests.id });
  return { id: result[0].id };
}
