/**
 * Shared DB entity types used across both MySQL and PostgreSQL schemas.
 * These provide explicit return types for db.ts helpers so tRPC can infer them.
 */

export interface DbUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface DbNewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string | null;
  titleEn: string | null;
  excerptEn: string | null;
  contentEn: string | null;
  titleRu: string | null;
  excerptRu: string | null;
  contentRu: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  publishedAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbGalleryImage {
  id: number;
  caption: string;
  imageUrl: string;
  imageKey: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface DbGalleryAlbum {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  titleEn: string | null;
  descriptionEn: string | null;
  titleRu: string | null;
  descriptionRu: string | null;
  coverUrl: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface DbGalleryAlbumWithPhotos extends DbGalleryAlbum {
  photos: { id: number; imageUrl: string; caption: string | null }[];
}

export interface DbGalleryPhoto {
  id: number;
  albumId: number;
  imageUrl: string;
  imageKey: string | null;
  caption: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface DbGasRequest {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  facilityAddress: string;
  facilityProvince: string;
  annualConsumption: string;
  usagePurpose: string | null;
  monthlyUsage: string | null;
  personnelName: string | null;
  personnelPosition: string | null;
  notes: string | null;
  createdAt: Date;
}
