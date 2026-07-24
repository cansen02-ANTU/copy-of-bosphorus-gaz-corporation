import { eq, desc } from "drizzle-orm";
import { ENV } from './_core/env';
import type { DbUser, DbNewsArticle, DbGalleryImage, DbGalleryAlbum, DbGalleryAlbumWithPhotos, DbGalleryPhoto, DbGasRequest } from '../shared/db-types';

// Dual-driver support: detect protocol from DATABASE_URL and use the correct driver/schema.
// - mysql:// → drizzle-orm/mysql2 + schema-mysql.ts (Manus sandbox / TiDB)
// - postgres:// → drizzle-orm/postgres-js + schema.ts (Render / self-hosted PostgreSQL)

const isMySQL = (process.env.DATABASE_URL ?? "").startsWith("mysql://");

// Dynamic imports to avoid loading both drivers at startup
let _db: any = null;
let _tables: any = null;

async function loadSchema() {
  if (_tables) return _tables;
  if (isMySQL) {
    _tables = await import("../drizzle/schema-mysql");
  } else {
    _tables = await import("../drizzle/schema");
  }
  return _tables;
}

export async function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  try {
    if (isMySQL) {
      const { drizzle } = await import("drizzle-orm/mysql2");
      const mysql = await import("mysql2/promise");
      const connection = await mysql.createPool({
        uri: url,
        ssl: { rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 5,
      });
      _db = drizzle(connection);
    } else {
      const { drizzle } = await import("drizzle-orm/postgres-js");
      const pg = await import("postgres");
      const client = pg.default(url, { ssl: 'require' });
      _db = drizzle(client);
    }
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    _db = null;
  }
  return _db;
}

// Helper to get tables (schema objects) regardless of dialect
async function tables() {
  return loadSchema();
}

// Ensure all required tables exist in production (PostgreSQL)
// This is needed because webdev_execute_sql only targets the sandbox MySQL DB.
let _tablesEnsured = false;
export async function ensureTables(): Promise<void> {
  if (_tablesEnsured) return;
  _tablesEnsured = true;
  const db = await getDb();
  if (!db) return;
  try {
    if (isMySQL) {
      // MySQL tables are managed via webdev_execute_sql — no action needed
      return;
    }
    // PostgreSQL: run CREATE TABLE IF NOT EXISTS for all tables
    const pg = await import("postgres");
    const url = process.env.DATABASE_URL;
    if (!url) return;
    const sql = pg.default(url, { ssl: 'require' });
    await sql`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(300) NOT NULL,
        "email" VARCHAR(320) NOT NULL,
        "subject" VARCHAR(500) NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql.end();
    console.log("[Database] ensureTables: contact_messages OK");
  } catch (err) {
    console.warn("[Database] ensureTables failed:", err);
  }
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function upsertUser(user: any): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const t = await tables();

  try {
    const values: any = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;

    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }

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

    if (isMySQL) {
      // MySQL uses onDuplicateKeyUpdate
      await db.insert(t.users).values(values).onDuplicateKeyUpdate({ set: updateSet });
    } else {
      // PostgreSQL uses onConflictDoUpdate
      await db.insert(t.users).values(values).onConflictDoUpdate({
        target: t.users.openId,
        set: updateSet,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<DbUser | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const t = await tables();
  const result = await db.select().from(t.users).where(eq(t.users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] as DbUser : undefined;
}

// ─── News Articles ───────────────────────────────────────────────────────────

export async function getNewsArticles(limit = 50): Promise<DbNewsArticle[]> {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  return db.select().from(t.newsArticles).orderBy(desc(t.newsArticles.publishedAt)).limit(limit) as Promise<DbNewsArticle[]>;
}

export async function getNewsArticleById(id: number): Promise<DbNewsArticle | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const t = await tables();
  const result = await db.select().from(t.newsArticles).where(eq(t.newsArticles.id, id)).limit(1);
  return result[0] as DbNewsArticle | undefined;
}

export async function createNewsArticle(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  if (isMySQL) {
    const result = await db.insert(t.newsArticles).values(data);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.newsArticles).values(data).returning({ id: t.newsArticles.id });
    return { id: result[0].id };
  }
}

export async function updateNewsArticle(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.update(t.newsArticles).set(data).where(eq(t.newsArticles.id, id));
}

export async function deleteNewsArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.delete(t.newsArticles).where(eq(t.newsArticles.id, id));
}

// ─── Gallery Images (legacy) ────────────────────────────────────────────────

export async function getGalleryImages(limit = 100): Promise<DbGalleryImage[]> {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  return db.select().from(t.galleryImages).orderBy(desc(t.galleryImages.sortOrder)).limit(limit) as Promise<DbGalleryImage[]>;
}

export async function createGalleryImage(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  if (isMySQL) {
    const result = await db.insert(t.galleryImages).values(data);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.galleryImages).values(data).returning({ id: t.galleryImages.id });
    return { id: result[0].id };
  }
}

export async function updateGalleryImage(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.update(t.galleryImages).set(data).where(eq(t.galleryImages.id, id));
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.delete(t.galleryImages).where(eq(t.galleryImages.id, id));
}

// ─── Gallery Albums & Photos ─────────────────────────────────────────────────

export async function getGalleryAlbums(): Promise<DbGalleryAlbum[]> {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  return db.select().from(t.galleryAlbums).orderBy(t.galleryAlbums.sortOrder) as Promise<DbGalleryAlbum[]>;
}

export async function getGalleryAlbumsWithPhotos(): Promise<DbGalleryAlbumWithPhotos[]> {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  const albums = await db.select().from(t.galleryAlbums).orderBy(t.galleryAlbums.sortOrder);
  const photos = await db.select().from(t.galleryPhotos).orderBy(t.galleryPhotos.sortOrder);
  return albums.map((album: any) => ({
    ...album,
    photos: photos
      .filter((p: any) => p.albumId === album.id)
      .map((p: any) => ({ id: p.id, imageUrl: p.imageUrl, caption: p.caption })),
  }));
}

// ─── Gallery Albums Admin CRUD ───────────────────────────────────────────────

export async function createGalleryAlbum(data: { slug: string; title: string; description?: string | null; coverUrl?: string | null; sortOrder?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  const values = {
    slug: data.slug,
    title: data.title,
    description: data.description ?? null,
    coverUrl: data.coverUrl ?? null,
    sortOrder: data.sortOrder ?? 0,
  };
  if (isMySQL) {
    const result = await db.insert(t.galleryAlbums).values(values);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.galleryAlbums).values(values).returning({ id: t.galleryAlbums.id });
    return { id: result[0].id };
  }
}

export async function updateGalleryAlbum(id: number, data: Partial<{ title: string; description: string | null; coverUrl: string | null; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.update(t.galleryAlbums).set(data).where(eq(t.galleryAlbums.id, id));
}

export async function deleteGalleryAlbum(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.delete(t.galleryPhotos).where(eq(t.galleryPhotos.albumId, id));
  await db.delete(t.galleryAlbums).where(eq(t.galleryAlbums.id, id));
}

export async function createGalleryPhoto(data: { albumId: number; imageUrl: string; imageKey?: string | null; caption?: string | null; sortOrder?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  const values = {
    albumId: data.albumId,
    imageUrl: data.imageUrl,
    imageKey: data.imageKey ?? null,
    caption: data.caption ?? null,
    sortOrder: data.sortOrder ?? 0,
  };
  if (isMySQL) {
    const result = await db.insert(t.galleryPhotos).values(values);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.galleryPhotos).values(values).returning({ id: t.galleryPhotos.id });
    return { id: result[0].id };
  }
}

export async function updateGalleryPhoto(id: number, data: Partial<{ imageUrl: string; imageKey: string | null; caption: string | null; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.update(t.galleryPhotos).set(data).where(eq(t.galleryPhotos.id, id));
}

export async function deleteGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  await db.delete(t.galleryPhotos).where(eq(t.galleryPhotos.id, id));
}

// ─── Gas Requests ──────────────────────────────────────────────

export async function createGasRequest(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  if (isMySQL) {
    const result = await db.insert(t.gasRequests).values(data);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.gasRequests).values(data).returning({ id: t.gasRequests.id });
    return { id: result[0].id };
  }
}

// ─── Contact Messages ──────────────────────────────────────────────

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const t = await tables();
  if (isMySQL) {
    const result = await db.insert(t.contactMessages).values(data);
    return { id: result[0].insertId };
  } else {
    const result = await db.insert(t.contactMessages).values(data).returning({ id: t.contactMessages.id });
    return { id: result[0].id };
  }
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  const { desc } = await import("drizzle-orm");
  return db.select().from(t.contactMessages).orderBy(desc(t.contactMessages.createdAt));
}

export async function getGasRequests() {
  const db = await getDb();
  if (!db) return [];
  const t = await tables();
  const { desc } = await import("drizzle-orm");
  return db.select().from(t.gasRequests).orderBy(desc(t.gasRequests.createdAt));
}
