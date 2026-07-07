import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { SEED_PRODUCTS } from "../src/lib/seed-products";

const forceReset = process.argv.includes("--reset");
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "ironmart.db"));
db.pragma("foreign_keys = ON");

const defaultSeller = db
  .prepare("SELECT id FROM users WHERE role = 'seller' ORDER BY id ASC LIMIT 1")
  .get() as { id: number } | undefined;
const defaultSellerId = defaultSeller?.id ?? null;

const upsert = db.prepare(`
  INSERT INTO products (id, name, seller_id, price, category, stock, rating, reviews, description, image)
  VALUES (@id, @name, @seller_id, @price, @category, @stock, @rating, @reviews, @description, @image)
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, seller_id=excluded.seller_id, price=excluded.price, category=excluded.category,
    stock=excluded.stock, rating=excluded.rating, reviews=excluded.reviews,
    description=excluded.description, image=excluded.image
`);

const tx = db.transaction(() => {
  if (forceReset) {
    db.prepare("DELETE FROM cart_items").run();
    db.prepare("DELETE FROM products").run();
    console.log("Reset: cleared all products.");
  }
  for (const p of SEED_PRODUCTS) upsert.run({ ...p, seller_id: defaultSellerId });
  if (defaultSellerId) {
    db.prepare("UPDATE products SET seller_id = ? WHERE seller_id IS NULL").run(defaultSellerId);
    db.prepare("UPDATE orders SET seller_id = ? WHERE seller_id IS NULL").run(defaultSellerId);
  }
});

tx();

const count = db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
console.log(`Catalog updated: ${SEED_PRODUCTS.length} seed products upserted (${count.c} total in DB).`);
if (!forceReset) {
  console.log("Custom products (p61+) were kept. Use --reset to wipe all products first.");
}
db.close();
