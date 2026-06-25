# Bosphorus Gaz Corporation — Corporate Website

Trilingual (Turkish / English / Russian) corporate website for Bosphorus Gaz Corporation A.Ş., Turkey's largest private natural gas importer. Built as a full-stack React + Express application with a tRPC API, a relational database, and Manus OAuth.

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, shadcn/ui, wouter (routing), Framer Motion
- **Backend:** Express 4, tRPC 11, superjson
- **Database:** MySQL/TiDB via Drizzle ORM
- **Auth:** Manus OAuth (session cookie + `protectedProcedure`)
- **Testing:** Vitest
- **Language:** TypeScript end-to-end

## Features

- Public marketing site: Home, Company (Şirketimiz), Natural Gas (Doğal Gaz), Press (Basın), Careers (Kariyer), Contact (İletişim)
- Full TR / EN / RU internationalization via URL-prefixed routing (`/`, `/en`, `/ru`)
- Database-driven news articles and photo gallery, each localized in all three languages
- Natural gas quote/request form with owner notifications
- Admin panels for managing news and gallery content (role-based access)

## Project Structure

```
client/            React frontend
  src/
    pages/         Page-level components
    components/    Reusable UI & shadcn/ui
    contexts/      React contexts (e.g. LanguageContext)
    lib/trpc.ts    tRPC client
    App.tsx        Routes & layout
  public/          Static assets (favicon, manifest, icons)
drizzle/           Database schema & migrations
server/            tRPC procedures, DB helpers, tests
  _core/           Framework plumbing (OAuth, context, Vite bridge)
shared/            Shared constants & types
storage/           S3 storage helpers
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (or npm)

### Install

```bash
pnpm install   # or: npm install
```

### Environment Variables

This project relies on system-provided environment variables (database URL, OAuth credentials, JWT secret, etc.). Create a `.env` file based on the variables referenced in `server/_core/env.ts`. **Never commit `.env` files or secrets.**

### Develop

```bash
pnpm dev       # starts the dev server on http://localhost:3000
```

### Build

```bash
pnpm build     # vite build + esbuild bundle of the server
pnpm start     # run the production build
```

### Test & Typecheck

```bash
pnpm test      # run the Vitest suite
pnpm check     # TypeScript typecheck (tsc --noEmit)
```

## Database

Schema lives in `drizzle/schema.ts`. To generate and apply migrations:

```bash
pnpm drizzle-kit generate   # generate SQL from schema changes
# apply the generated SQL to your database
```

## License

Proprietary — © Bosphorus Gaz Corporation A.Ş. All rights reserved.
