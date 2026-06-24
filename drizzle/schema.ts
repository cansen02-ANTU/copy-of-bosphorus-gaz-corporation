import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * News articles for the Basın (Press) page.
 */
export const newsArticles = mysqlTable("news_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 500 }),
  publishedAt: bigint("publishedAt", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

/**
 * Gallery images for the Basın (Press) page photo gallery.
 */
export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  caption: varchar("caption", { length: 500 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Photo gallery albums for the Basın → Foto Galeri page.
 */
export const galleryAlbums = mysqlTable("gallery_albums", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type InsertGalleryAlbum = typeof galleryAlbums.$inferInsert;

/**
 * Individual photos belonging to a gallery album.
 */
export const galleryPhotos = mysqlTable("gallery_photos", {
  id: int("id").autoincrement().primaryKey(),
  albumId: int("albumId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  caption: varchar("caption", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

/**
 * Natural gas supply requests submitted via the Doğal Gaz Bilgi Formu.
 */
export const gasRequests = mysqlTable("gas_requests", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 500 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 300 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 100 }).notNull(),
  facilityAddress: text("facilityAddress").notNull(),
  facilityProvince: varchar("facilityProvince", { length: 200 }).notNull(),
  annualConsumption: varchar("annualConsumption", { length: 50 }).notNull(),
  usagePurpose: varchar("usagePurpose", { length: 50 }),
  monthlyUsage: text("monthlyUsage"),
  personnelName: varchar("personnelName", { length: 300 }),
  personnelPosition: varchar("personnelPosition", { length: 300 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GasRequest = typeof gasRequests.$inferSelect;
export type InsertGasRequest = typeof gasRequests.$inferInsert;
