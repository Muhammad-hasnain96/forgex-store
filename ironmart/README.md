# SilkLane — Pakistani Fashion

Full-stack online clothing store for **ladies & gents shalwar kameez**, kurtas, formal wear, and unstitched fabric. Built with **Next.js 16**, **SQLite**, and **JWT authentication**.

## Features

- Shop with search, ladies/gents filter, category filter, and sort
- 60 seeded Pakistani clothing products
- Cart, wishlist, checkout with promo codes & shipping
- Full order lifecycle (pending → packed → shipped → delivered)
- Admin dashboard with stats, low-stock alerts, image upload
- Seller order fulfilment panel with payout reports
- Order confirmation with printable receipt

## Quick start

```bash
cd ironmart
npm install
npm run db:reset   # replace hardware catalog with clothing products
npm run dev
```

Open **http://localhost:3000**

Database auto-creates at `data/ironmart.db` on first run.

## Demo accounts

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Customer | demo@example.com    | demo123    |
| Seller   | seller@silklane.pk  | seller123  |
| Admin    | admin@silklane.pk   | admin123   |

## Promo codes

| Code    | Discount |
|---------|----------|
| STYLE10 | 10%      |
| EID15   | 15%      |
| WELCOME | 5%       |

## Shipping

- Standard delivery: **Rs. 200**
- **Free shipping** on orders over **Rs. 3,000**

## Product categories

- Ladies Shalwar Kameez
- Gents Shalwar Kameez
- Ladies Kurtas
- Gents Kurtas
- Formal & Wedding
- Unstitched Fabric
- Dupatta & Shawl

## Scripts

| Command           | Description                           |
|-------------------|---------------------------------------|
| `npm run dev`     | Development server                    |
| `npm run build`   | Production build                      |
| `npm run start`   | Run production server                 |
| `npm run db:seed` | Upsert catalog (keeps custom products)|
| `npm run db:reset`| Wipe all products and re-seed         |

## Environment

Copy `.env.example` to `.env.local` and set `AUTH_SECRET` before production deploy.
