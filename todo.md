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
