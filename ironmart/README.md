# ForgeX — Pro Grade Hardware

Full-stack hardware store built with **Next.js 16**, **SQLite**, and **JWT authentication**.

## Features

- Customer shop with search, category filter, and sort
- Secure auth (bcrypt + HTTP-only cookies)
- SQLite database with 60 seeded products
- Cart, wishlist, checkout with promo codes & shipping
- Order tracking (placed → shipped → delivered)
- Admin dashboard with stats, low-stock alerts, image upload
- Seller order fulfilment panel
- Order confirmation with printable receipt
- Privacy, terms, and contact pages

## Quick start

```bash
cd ironmart
npm install
npm run db:seed    # load/update 60 products
npm run dev
```

Open **http://localhost:3000**

Database auto-creates at `data/ironmart.db` on first run.

## Demo accounts

| Role     | Email                 | Password   |
|----------|-----------------------|------------|
| Customer | demo@example.com      | demo123    |
| Seller   | seller@ironmart.com   | seller123  |
| Admin    | admin@ironmart.com    | admin123   |

## Promo codes

| Code    | Discount |
|---------|----------|
| IRON10  | 10%      |
| IRON20  | 20%      |
| WELCOME | 5%       |

## Shipping

- Standard delivery: **Rs. 200**
- **Free shipping** on orders over **Rs. 5,000**

## Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Development server                   |
| `npm run build`  | Production build                     |
| `npm run start`  | Run production server                |
| `npm run db:seed`| Upsert catalog (keeps custom products)|
| `npm run db:reset`| Wipe all products and re-seed       |

## Project structure

```
ironmart/
├── data/ironmart.db       # SQLite database
├── public/uploads/        # Uploaded product images
├── src/app/               # Pages & API routes
├── src/components/        # UI components
├── src/lib/               # DB, auth, config, seed data
└── scripts/seed-products.ts
```

## Environment

Copy `.env.example` to `.env.local` and set `AUTH_SECRET` before production deploy.

## Production deploy

1. Set `AUTH_SECRET` in environment
2. Run `npm run build && npm run start`
3. Or deploy to [Vercel](https://vercel.com) (SQLite works locally; use PostgreSQL for cloud scale)

## Note on ironmart-store.html

The standalone HTML file in the parent folder is a legacy demo. **Use this Next.js app** (`ironmart/`) as the main project.
