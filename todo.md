# Bosphorus Gaz Corporation — Migration TODO

## Source migration
- [x] Migrate client pages (Home, Company, NaturalGas, News/Press, Gallery, Careers, Contact, Admin*, NotFound, ComponentShowcase)
- [x] Migrate client components (Header, Footer, IndustryBubbles, ScrollToTop, Map, etc.)
- [x] Migrate client contexts (LanguageContext, ThemeContext)
- [x] Migrate client hooks and lib
- [x] Migrate client index.css and index.html (fonts, meta, lang=tr)
- [x] Migrate App.tsx, main.tsx, const.ts
- [x] Migrate server routers.ts, db.ts, storage.ts, server/index.ts
- [x] Migrate shared const.ts and types.ts
- [x] Migrate drizzle schema + migrations

## Core merges (preserve custom features, keep newer framework code)
- [x] Merge admin_session auth into server/_core/context.ts
- [x] Add ADMIN_USERNAME/ADMIN_PASSWORD to server/_core/env.ts
- [x] Add trust proxy to server/_core/index.ts

## Infrastructure
- [x] Align dependencies (all already present in scaffold; no missing packages)
- [x] Apply Drizzle schema migrations (users, news_articles, gallery_images)
- [x] Configure ADMIN_USERNAME / ADMIN_PASSWORD secrets

## Features to verify
- [x] Multi-language Turkish/English support (LanguageContext, TR/EN toggle in header)
- [x] Public routes: Home, Şirketimiz, Doğal Gaz, Basın (news+gallery), Kariyer, İletişim
- [x] News listing + detail pages (DB-backed; verified live render with test row, then cleaned up; empty/loading states present)
- [x] Gallery/media section (DB-backed; verified live render with test row, then cleaned up; empty/loading states present)
- [x] Admin login (username/password) — endpoint verified, invalid creds rejected, vitest passes; adminProcedure-gated CRUD for news & gallery
- [x] Map: original repo uses a stylized SVG placeholder (not a live Google Maps embed); restored as-is per "follow existing design exactly". Live Google Map can be wired on request.
- [x] S3-backed file storage for uploads (storage.ts migrated, helpers present)

## QA
- [x] Dev server runs without errors
- [x] vitest passes (29/29)
- [x] TypeScript check passes (0 errors)
- [x] Visual verification of key pages
- [x] users / news_articles / gallery_images tables all confirmed present
- [x] Save checkpoint and deliver preview

## Russian (RU) Language Support
- [x] Refactor LanguageContext: add "ru" to Language type, extend t() to accept a third Russian argument, keep TR/EN behavior intact
- [x] Add RU toggle button in Header (desktop + mobile) working like the EN toggle
- [x] Translate all t(tr, en) calls site-wide to t(tr, en, ru) with context-appropriate Russian
- [x] Translate data structures with Tr/En fields (Header nav, Footer, DashboardLayout, IndustryBubbles, Home news, Careers values, Company timeline/management, NaturalGas FAQ/months)
- [x] Update date locale (tr-TR/en-US) to add ru-RU (Press, AdminNews)
- [x] Verify build, run vitest (29/29 pass), typecheck clean

## URL Language Prefix Routing (SEO-friendly shareable URLs)
- [x] LanguageContext reads active language from URL prefix (/en, /ru) as source of truth; TR = un-prefixed root
- [x] App.tsx: wrap public routes in wouter <Router base={langBase}> so all internal Links auto-resolve under the active prefix
- [x] Persist language choice but let URL win on direct navigation/share
- [x] Header toggle navigates to the same page under the new language prefix (TR/EN/RU)
- [x] Keep admin routes un-prefixed; ensure /admin still works
- [x] Set <html lang> attribute dynamically per active language
- [x] Dynamic document.title per language
- [x] Verify: direct-load /ru/dogal-gaz and /en/sirketimiz render correct language; toggling updates URL; TR root still works (browser-verified)
- [x] Typecheck clean + 29/29 vitest pass + production build OK

## Copy News from bosphorusgaz.com to Press/Haberler
- [x] Seed 10 news articles into news_articles table (title, excerpt, content, publishedAt) matching source order
- [x] Add Haberler-style pagination to Press page (6 per page, prev/next + numbered controls)
- [x] Add clickable article detail dialog (full content with preserved line breaks)
- [x] Verify build, run vitest (29/29), screenshot Press page
- [x] Clean up seed helper scripts (seed-news.sql, seed-news.mjs, gen-seed-sql.mjs)

## Copy News Page 2 from bosphorusgaz.com/basin/haberler/page/2
- [x] Extract 10 page-2 articles (full bodies + dates) via webpage_extract
- [x] Seed page-2 articles (late-2016/early-2017) → total 20, paginated into 4 pages
- [x] Verify total=20 and newlines stored correctly (real_nl>0, literal=0)
- [x] Clean up page-2 seed helper scripts (gen-seed-sql-p2.mjs, seed-news-p2.sql)

## Copy News Page 3 from bosphorusgaz.com/basin/haberler/page/3
- [x] Extract 10 page-3 articles (full bodies + dates) via webpage_extract
- [x] Seed page-3 articles (2014-2016 events) -> total 30, paginated into 5 pages
- [x] Verify total=30 and newlines stored correctly (real_nl>0, literal=0)
- [x] Clean up page-3 seed helper scripts (gen-seed-sql-p3.mjs, seed-news-p3.sql)

## Photo Gallery (Basın → Foto Galeri) from bosphorusgaz.com/basin/foto-galeri
- [x] Study source gallery structure (4 albums, NextGEN, lightbox)
- [x] Scrape all 127 image URLs across the 4 albums (29 + 53 + 18 + 27)
- [x] Download all 127 images and mirror them to webdev storage (permanent /manus-storage URLs)
- [x] Add gallery_albums + gallery_photos tables (migration 0002) and apply via webdev_execute_sql
- [x] Seed 4 albums + 127 photos preserving source order (verified counts)
- [x] Add getGalleryAlbumsWithPhotos db helper + gallery.albums tRPC procedure
- [x] Build Gallery.tsx page (albums grid + click-to-open lightbox with thumbnails, keyboard nav)
- [x] Add /basin/foto-galeri and /basin/haberler routes
- [x] Add Basın → Haberler / Foto Galeri sub-nav on both pages + Header dropdown
- [x] Remove old flat gallery section from Press page
- [x] Add vitest for gallery.albums shape (31/31 pass), typecheck + build clean
- [x] Clean up scraper/seed helper scripts


## Wire Doğal Gaz Request Form (submit + notify)
- [x] Add gas_requests table (schema + migration 0003 applied)
- [x] Add createGasRequest db helper
- [x] Add public gasRequest.submit procedure (validate + persist + notifyOwner, recipient information@bosphorusgaz.com)
- [x] Make the NaturalGas form controlled (all fields + 12 monthly inputs) with loading/error/success states
- [x] Add vitest coverage for gasRequest.submit (validation, persistence, notify, graceful notify failure) — 37/37 pass
- [x] Verify full pipeline via direct tRPC call (success:true, row persisted), then clean up test row

## English News (EN Haberler page) from bosphorusgaz.com/media/news?lang=en
- [x] Extract 10 English articles (page 1) with full bodies via webpage_extract
- [x] Map each EN article to its existing TR row by date/topic
- [x] Add titleEn/excerptEn/contentEn columns (migration 0004) and apply
- [x] Backfill EN content into the 10 matched rows (verified en_count=10)
- [x] Render EN title/excerpt/content on Press page when lang=en (fallback to TR)
- [x] Typecheck + 37/37 tests, browser-verify EN/TR, clean up helper scripts

## Translate remaining TR news to English (EN list shows English-only)
- [x] Identify the 20 TR articles missing titleEn/excerptEn/contentEn and export them
- [x] Translate each (title, excerpt, full body) into natural English, preserving paragraph breaks
- [x] Backfill EN columns (UPDATED=20); verify all 30 articles have EN content (MISSING=0)
- [x] Browser-verify EN Haberler list shows only English; TR unchanged
- [x] Typecheck + 37/37 tests pass, cleaned up helpers, checkpoint

## Russian News (RU Haberler page) — translate all 30 articles
- [x] Add titleRu/excerptRu/contentRu columns to news_articles (migration 0006, applied)
- [x] Export all 30 articles (TR + EN) to translate into Russian
- [x] Backfill RU columns for all 30 articles preserving paragraph breaks (verified title=30 excerpt=30 content=30)
- [x] Render RU title/excerpt/content on the Press page when lang=ru (fallback to TR)
- [x] Typecheck + 38/38 tests pass, browser-verify RU Haberler, checkpoint

## Custom Admin Auth (replace Manus OAuth)
- [x] Create server-side admin login/logout tRPC procedures with JWT session (already existed)
- [x] Build dedicated /admin/login page with username/password form (already existed)
- [x] Update admin pages to use new auth flow instead of Manus OAuth (already used adminAuth)
- [x] Ensure public site continues to work without OAuth (context.ts skips OAuth when env vars missing)
- [x] Typecheck + 38/38 tests pass, build succeeds

## Fix Admin Gallery Panel (reads wrong table)
- [x] Rewrite AdminGallery.tsx to query gallery.albums (gallery_albums + gallery_photos) instead of gallery.list (legacy gallery_images)
- [x] Add admin CRUD procedures for gallery_albums and gallery_photos (createAlbum, updateAlbum, deleteAlbum, addPhoto, deletePhoto)
- [x] Verify admin panel displays existing 4 albums with 127 photos
- [x] Add updateGalleryPhoto db helper + gallery.updatePhoto admin procedure
- [x] Browser-verify album detail view shows photos from gallery_photos (4 albums visible in admin grid)
