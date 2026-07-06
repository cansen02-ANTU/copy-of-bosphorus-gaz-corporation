import { bigint, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * News articles for the Basın (Press) page.
 */
export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  titleEn: varchar("titleEn", { length: 500 }),
  excerptEn: text("excerptEn"),
  contentEn: text("contentEn"),
  titleRu: varchar("titleRu", { length: 500 }),
  excerptRu: text("excerptRu"),
  contentRu: text("contentRu"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 500 }),
  publishedAt: bigint("publishedAt", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

/**
 * Gallery images for the Basın (Press) page photo gallery.
 */
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  caption: varchar("caption", { length: 500 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Photo gallery albums for the Basın → Foto Galeri page.
 */
export const galleryAlbums = pgTable("gallery_albums", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  titleEn: varchar("titleEn", { length: 500 }),
  descriptionEn: text("descriptionEn"),
  titleRu: varchar("titleRu", { length: 500 }),
  descriptionRu: text("descriptionRu"),
  coverUrl: text("coverUrl"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type InsertGalleryAlbum = typeof galleryAlbums.$inferInsert;

/**
 * Individual photos belonging to a gallery album.
 */
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  albumId: integer("albumId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  caption: varchar("caption", { length: 500 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

/**
 * Natural gas supply requests submitted via the Doğal Gaz Bilgi Formu.
 */
export const gasRequests = pgTable("gas_requests", {
  id: serial("id").primaryKey(),
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
