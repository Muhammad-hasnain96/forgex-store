import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { Order, OrderItem, Product, User, UserRole } from "./types";
import { SEED_PRODUCTS } from "./seed-products";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "ironmart.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  migrateSchema(db);
  seedIfEmptySync(db);
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      seller_id INTEGER,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL,
      rating REAL NOT NULL DEFAULT 4.5,
      reviews INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      total INTEGER NOT NULL,
      address_name TEXT NOT NULL,
      address_phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      address_city TEXT NOT NULL,
      pay_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      tracking_number TEXT,
      estimated_delivery_at TEXT,
      cancellable_until TEXT,
      return_requested_at TEXT,
      seller_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      discount_percent INTEGER NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS stock_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      released INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stock_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      order_id TEXT,
      change_qty INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS seller_commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      order_id TEXT NOT NULL,
      gross_amount INTEGER NOT NULL,
      commission_rate REAL NOT NULL,
      commission_amount INTEGER NOT NULL,
      net_amount INTEGER NOT NULL,
      period_key TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS back_in_stock_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, product_id)
    );
  `);
}

function migrateSchema(database: Database.Database) {
  const cols = (database.prepare("PRAGMA table_info(orders)").all() as { name: string }[]).map((c) => c.name);
  if (!cols.includes("subtotal")) database.exec(`ALTER TABLE orders ADD COLUMN subtotal INTEGER NOT NULL DEFAULT 0`);
  if (!cols.includes("shipping_fee")) database.exec(`ALTER TABLE orders ADD COLUMN shipping_fee INTEGER NOT NULL DEFAULT 0`);
  if (!cols.includes("discount")) database.exec(`ALTER TABLE orders ADD COLUMN discount INTEGER NOT NULL DEFAULT 0`);
  if (!cols.includes("promo_code")) database.exec(`ALTER TABLE orders ADD COLUMN promo_code TEXT`);
  if (!cols.includes("tracking_number")) database.exec(`ALTER TABLE orders ADD COLUMN tracking_number TEXT`);
  if (!cols.includes("estimated_delivery_at")) database.exec(`ALTER TABLE orders ADD COLUMN estimated_delivery_at TEXT`);
  if (!cols.includes("cancellable_until")) database.exec(`ALTER TABLE orders ADD COLUMN cancellable_until TEXT`);
  if (!cols.includes("return_requested_at")) database.exec(`ALTER TABLE orders ADD COLUMN return_requested_at TEXT`);
  if (!cols.includes("seller_id")) database.exec(`ALTER TABLE orders ADD COLUMN seller_id INTEGER`);

  const productCols = (database.prepare("PRAGMA table_info(products)").all() as { name: string }[]).map((c) => c.name);
  if (!productCols.includes("seller_id")) database.exec(`ALTER TABLE products ADD COLUMN seller_id INTEGER`);

  const promoCount = database.prepare("SELECT COUNT(*) as c FROM promo_codes").get() as { c: number };
  if (promoCount.c === 0) {
    const insert = database.prepare(`INSERT INTO promo_codes (code, discount_percent, active) VALUES (?, ?, 1)`);
    insert.run("STYLE10", 10);
    insert.run("EID15", 15);
    insert.run("WELCOME", 5);
  } else {
    database.prepare("UPDATE promo_codes SET code='STYLE10', discount_percent=10 WHERE code='IRON10'").run();
    database.prepare("UPDATE promo_codes SET code='EID15', discount_percent=15 WHERE code='IRON20'").run();
  }

  database.prepare("UPDATE users SET email='seller@silklane.pk', name='SilkLane Seller' WHERE email='seller@ironmart.com'").run();
  database.prepare("UPDATE users SET email='admin@silklane.pk' WHERE email='admin@ironmart.com'").run();
}

function seedIfEmptySync(database: Database.Database) {
  const count = database.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
  if (count.c > 0) return;

  const insertUser = database.prepare(`
    INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)
  `);
  insertUser.run("Demo Customer", "demo@example.com", bcrypt.hashSync("demo123", 10), "customer");
  insertUser.run("SilkLane Seller", "seller@silklane.pk", bcrypt.hashSync("seller123", 10), "seller");
  insertUser.run("Store Admin", "admin@silklane.pk", bcrypt.hashSync("admin123", 10), "admin");

  const sellerRow = database
    .prepare("SELECT id FROM users WHERE role = 'seller' ORDER BY id ASC LIMIT 1")
    .get() as { id: number } | undefined;
  const defaultSellerId = sellerRow?.id ?? null;

  const insertProduct = database.prepare(`
    INSERT INTO products (id, name, seller_id, price, category, stock, rating, reviews, description, image)
    VALUES (@id, @name, @seller_id, @price, @category, @stock, @rating, @reviews, @description, @image)
  `);

  const insertMany = database.transaction((products: typeof SEED_PRODUCTS) => {
    for (const p of products) insertProduct.run({ ...p, seller_id: defaultSellerId });
  });
  insertMany(SEED_PRODUCTS);
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    sellerId: (row.seller_id as number | null) ?? null,
    price: row.price as number,
    category: row.category as string,
    stock: row.stock as number,
    rating: row.rating as number,
    reviews: row.reviews as number,
    description: row.description as string,
    image: row.image as string,
  };
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    role: row.role as UserRole,
  };
}

export const productDb = {
  list(): Product[] {
    const rows = getDb().prepare("SELECT * FROM products ORDER BY name").all();
    return rows.map((r) => rowToProduct(r as Record<string, unknown>));
  },

  getById(id: string): Product | null {
    const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id);
    return row ? rowToProduct(row as Record<string, unknown>) : null;
  },

  create(product: Product) {
    getDb()
      .prepare(
        `INSERT INTO products (id, name, seller_id, price, category, stock, rating, reviews, description, image)
         VALUES (@id, @name, @sellerId, @price, @category, @stock, @rating, @reviews, @description, @image)`
      )
      .run(product);
  },

  update(id: string, product: Omit<Product, "id">) {
    getDb()
      .prepare(
        `UPDATE products SET name=@name, seller_id=@sellerId, price=@price, category=@category, stock=@stock,
         rating=@rating, reviews=@reviews, description=@description, image=@image WHERE id=@id`
      )
      .run({ ...product, id });
  },

  delete(id: string) {
    const database = getDb();
    const tx = database.transaction(() => {
      database.prepare("DELETE FROM cart_items WHERE product_id = ?").run(id);
      database.prepare("DELETE FROM products WHERE id = ?").run(id);
    });
    tx();
  },

  nextId(): string {
    const rows = getDb().prepare("SELECT id FROM products").all() as { id: string }[];
    const max = rows.reduce((m, r) => Math.max(m, parseInt(r.id.slice(1), 10) || 0), 0);
    return `p${max + 1}`;
  },

  decrementStock(productId: string, qty: number) {
    getDb().prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?").run(qty, productId, qty);
  },

  listLowStock(threshold: number): Product[] {
    return productDb.list().filter((p) => p.stock > 0 && p.stock <= threshold);
  },

  listInStock(): Product[] {
    return productDb.list().filter((p) => p.stock > 0);
  },
};

export const userDb = {
  findByEmail(email: string) {
    return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as
      | (Record<string, unknown> & { password_hash: string })
      | undefined;
  },

  findById(id: number): User | null {
    const row = getDb().prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(id);
    return row ? rowToUser(row as Record<string, unknown>) : null;
  },

  async create(name: string, email: string, password: string, role: UserRole = "customer"): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    const result = getDb()
      .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)")
      .run(name, email.toLowerCase(), hash, role);
    return { id: Number(result.lastInsertRowid), name, email: email.toLowerCase(), role };
  },
};

export const cartDb = {
  list(userId: number) {
    const rows = getDb()
      .prepare(
        `SELECT c.product_id, c.qty,
         p.id, p.name, p.price, p.category, p.stock, p.rating, p.reviews, p.description, p.image
         FROM cart_items c
         JOIN products p ON p.id = c.product_id WHERE c.user_id = ?`
      )
      .all(userId) as Record<string, unknown>[];

    return rows.map((r) => ({
      productId: r.product_id as string,
      qty: r.qty as number,
      product: rowToProduct(r),
    }));
  },

  upsert(userId: number, productId: string, qty: number) {
    if (qty <= 0) {
      getDb().prepare("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?").run(userId, productId);
      return;
    }
    getDb()
      .prepare(
        `INSERT INTO cart_items (user_id, product_id, qty) VALUES (?, ?, ?)
         ON CONFLICT(user_id, product_id) DO UPDATE SET qty = excluded.qty`
      )
      .run(userId, productId, qty);
  },

  clear(userId: number) {
    getDb().prepare("DELETE FROM cart_items WHERE user_id = ?").run(userId);
  },

  count(userId: number): number {
    const row = getDb()
      .prepare("SELECT COALESCE(SUM(qty), 0) as total FROM cart_items WHERE user_id = ?")
      .get(userId) as { total: number };
    return row.total;
  },
};

function rowToOrder(row: Record<string, unknown>, items: OrderItem[]): Order {
  const total = row.total as number;
  return {
    id: row.id as string,
    userId: row.user_id as number,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    subtotal: (row.subtotal as number) || total,
    shippingFee: (row.shipping_fee as number) || 0,
    discount: (row.discount as number) || 0,
    promoCode: (row.promo_code as string) || null,
    total,
    address: {
      name: row.address_name as string,
      phone: row.address_phone as string,
      address: row.address_line as string,
      city: row.address_city as string,
    },
    payMethod: row.pay_method as "cod" | "card",
    status: row.status as Order["status"],
    trackingNumber: (row.tracking_number as string) || null,
    estimatedDeliveryAt: (row.estimated_delivery_at as string) || null,
    cancellableUntil: (row.cancellable_until as string) || null,
    returnRequestedAt: (row.return_requested_at as string) || null,
    sellerId: (row.seller_id as number | null) ?? null,
    items,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const orderDb = {
  listForUser(userId: number): Order[] {
    return orderDb.listAll().filter((o) => o.userId === userId);
  },

  listAll(): Order[] {
    const database = getDb();
    const orders = database.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as Record<string, unknown>[];
    const itemStmt = database.prepare("SELECT * FROM order_items WHERE order_id = ?");

    return orders.map((o) => {
      const items = (itemStmt.all(o.id as string) as Record<string, unknown>[]).map((i) => ({
        productId: i.product_id as string,
        name: i.name as string,
        qty: i.qty as number,
        price: i.price as number,
      }));
      return rowToOrder(o, items);
    });
  },

  create(order: Order) {
    const database = getDb();
    const tx = database.transaction(() => {
      database
        .prepare(
          `INSERT INTO orders (id, user_id, customer_name, customer_email, subtotal, shipping_fee, discount, promo_code, total,
           address_name, address_phone, address_line, address_city, pay_method, status, tracking_number, estimated_delivery_at,
           cancellable_until, return_requested_at, seller_id, created_at, updated_at)
           VALUES (@id, @userId, @customerName, @customerEmail, @subtotal, @shippingFee, @discount, @promoCode, @total,
           @addressName, @addressPhone, @addressLine, @addressCity, @payMethod, @status, @trackingNumber, @estimatedDeliveryAt,
           @cancellableUntil, @returnRequestedAt, @sellerId, @createdAt, @updatedAt)`
        )
        .run({
          id: order.id,
          userId: order.userId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          discount: order.discount,
          promoCode: order.promoCode ?? null,
          total: order.total,
          addressName: order.address.name,
          addressPhone: order.address.phone,
          addressLine: order.address.address,
          addressCity: order.address.city,
          payMethod: order.payMethod,
          status: order.status,
          trackingNumber: order.trackingNumber ?? null,
          estimatedDeliveryAt: order.estimatedDeliveryAt ?? null,
          cancellableUntil: order.cancellableUntil ?? null,
          returnRequestedAt: order.returnRequestedAt ?? null,
          sellerId: order.sellerId ?? null,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        });

      const insertItem = database.prepare(
        `INSERT INTO order_items (order_id, product_id, name, qty, price) VALUES (?, ?, ?, ?, ?)`
      );
      const reserveStmt = database.prepare(
        `INSERT INTO stock_reservations (order_id, product_id, user_id, qty, expires_at, released)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      const ledgerStmt = database.prepare(
        `INSERT INTO stock_ledger (product_id, order_id, change_qty, reason) VALUES (?, ?, ?, ?)`
      );
      for (const item of order.items) {
        insertItem.run(order.id, item.productId, item.name, item.qty, item.price);
        reserveStmt.run(order.id, item.productId, order.userId, item.qty, order.cancellableUntil ?? order.createdAt, 0);
        productDb.decrementStock(item.productId, item.qty);
        ledgerStmt.run(item.productId, order.id, -item.qty, "order_confirmed");
      }

      if (order.sellerId && order.status !== "cancelled" && order.status !== "refunded") {
        const commissionRate = 0.08;
        const commissionAmount = Math.round(order.total * commissionRate);
        const periodKey = (order.createdAt || new Date().toISOString()).slice(0, 7);
        database
          .prepare(
            `INSERT INTO seller_commissions (seller_id, order_id, gross_amount, commission_rate, commission_amount, net_amount, period_key)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .run(order.sellerId, order.id, order.total, commissionRate, commissionAmount, order.total - commissionAmount, periodKey);
      }
    });
    tx();
  },

  updateStatus(id: string, status: Order["status"], opts?: { trackingNumber?: string; estimatedDeliveryAt?: string }) {
    getDb()
      .prepare("UPDATE orders SET status = ?, tracking_number = COALESCE(?, tracking_number), estimated_delivery_at = COALESCE(?, estimated_delivery_at), updated_at = datetime('now') WHERE id = ?")
      .run(status, opts?.trackingNumber ?? null, opts?.estimatedDeliveryAt ?? null, id);
  },

  markReturnRequested(id: string) {
    getDb()
      .prepare("UPDATE orders SET return_requested_at = datetime('now'), status = 'refunded', updated_at = datetime('now') WHERE id = ?")
      .run(id);
  },

  listForSeller(
    sellerId: number,
    filters?: { status?: string; city?: string; from?: string; to?: string }
  ): Order[] {
    const all = orderDb.listAll().filter((o) => o.sellerId === sellerId);
    return all.filter((o) => {
      if (filters?.status && o.status !== filters.status) return false;
      if (filters?.city && !o.address.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters?.from && o.createdAt < filters.from) return false;
      if (filters?.to && o.createdAt > filters.to) return false;
      return true;
    });
  },

  releaseExpiredReservations() {
    const database = getDb();
    const expired = database
      .prepare(
        `SELECT * FROM stock_reservations
         WHERE released = 0 AND datetime(expires_at) < datetime('now')`
      )
      .all() as { id: number; product_id: string; qty: number; order_id: string }[];
    const updateStock = database.prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
    const markReleased = database.prepare("UPDATE stock_reservations SET released = 1 WHERE id = ?");
    const ledgerStmt = database.prepare(
      "INSERT INTO stock_ledger (product_id, order_id, change_qty, reason) VALUES (?, ?, ?, ?)"
    );
    for (const r of expired) {
      updateStock.run(r.qty, r.product_id);
      markReleased.run(r.id);
      ledgerStmt.run(r.product_id, r.order_id, r.qty, "reservation_expired");
    }
  },

  getById(id: string): Order | null {
    return orderDb.listAll().find((o) => o.id === id) ?? null;
  },
};

export const wishlistDb = {
  list(userId: number) {
    const rows = getDb()
      .prepare(
        `SELECT w.product_id, p.* FROM wishlist w
         JOIN products p ON p.id = w.product_id WHERE w.user_id = ?`
      )
      .all(userId) as Record<string, unknown>[];
    return rows.map((r) => rowToProduct(r));
  },

  toggle(userId: number, productId: string): boolean {
    const existing = getDb()
      .prepare("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?")
      .get(userId, productId);
    if (existing) {
      getDb().prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(userId, productId);
      return false;
    }
    getDb().prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)").run(userId, productId);
    return true;
  },

  has(userId: number, productId: string): boolean {
    return !!getDb()
      .prepare("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?")
      .get(userId, productId);
  },

  count(userId: number): number {
    const row = getDb().prepare("SELECT COUNT(*) as c FROM wishlist WHERE user_id = ?").get(userId) as { c: number };
    return row.c;
  },
};

export const promoDb = {
  validate(code: string) {
    const row = getDb()
      .prepare("SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?) AND active = 1")
      .get(code.trim()) as { code: string; discount_percent: number } | undefined;
    if (!row) return null;
    return { code: row.code, discountPercent: row.discount_percent };
  },
};

export const statsDb = {
  adminStats(): import("./types").AdminStats {
    const database = getDb();
    const productCount = (database.prepare("SELECT COUNT(*) as c FROM products WHERE stock > 0").get() as { c: number }).c;
    const lowStockCount = (database.prepare("SELECT COUNT(*) as c FROM products WHERE stock > 0 AND stock <= 10").get() as { c: number }).c;
    const orderCount = (database.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c;
    const revenueTotal = (database.prepare("SELECT COALESCE(SUM(total), 0) as t FROM orders").get() as { t: number }).t;
    const ordersToday = (
      database.prepare("SELECT COUNT(*) as c FROM orders WHERE date(created_at) = date('now')").get() as { c: number }
    ).c;
    return { productCount, lowStockCount, orderCount, revenueTotal, ordersToday };
  },
};

export const sellerDb = {
  getByEmail(email: string): { id: number; email: string } | null {
    const row = getDb()
      .prepare("SELECT id, email FROM users WHERE role = 'seller' AND email = ?")
      .get(email.toLowerCase()) as { id: number; email: string } | undefined;
    return row ?? null;
  },

  payoutReport(sellerId: number, periodKey: string) {
    const dbx = getDb();
    const row = dbx
      .prepare(
        `SELECT
           COALESCE(SUM(gross_amount), 0) as gross,
           COALESCE(SUM(commission_amount), 0) as commission,
           COALESCE(SUM(net_amount), 0) as net,
           COUNT(*) as deliveredOrders,
           MAX(commission_rate) as commissionRate
         FROM seller_commissions
         WHERE seller_id = ? AND period_key = ?`
      )
      .get(sellerId, periodKey) as {
        gross: number;
        commission: number;
        net: number;
        deliveredOrders: number;
        commissionRate: number;
      };
    return {
      grossSales: row.gross,
      commissionAmount: row.commission,
      netPayout: row.net,
      deliveredOrders: row.deliveredOrders,
      commissionRate: row.commissionRate || 0.08,
    };
  },

  defaultSellerId(): number | null {
    const row = getDb()
      .prepare("SELECT id FROM users WHERE role = 'seller' ORDER BY id ASC LIMIT 1")
      .get() as { id: number } | undefined;
    return row?.id ?? null;
  },
};

export const stockDb = {
  ledger(productId?: string) {
    if (productId) {
      return getDb()
        .prepare("SELECT * FROM stock_ledger WHERE product_id = ? ORDER BY created_at DESC")
        .all(productId);
    }
    return getDb().prepare("SELECT * FROM stock_ledger ORDER BY created_at DESC LIMIT 300").all();
  },
};

export const notifyDb = {
  subscribeBackInStock(userId: number, productId: string) {
    getDb()
      .prepare(
        `INSERT INTO back_in_stock_subscriptions (user_id, product_id) VALUES (?, ?)
         ON CONFLICT(user_id, product_id) DO NOTHING`
      )
      .run(userId, productId);
  },

  subscribersFor(productId: string) {
    return getDb()
      .prepare(
        `SELECT b.user_id, u.email FROM back_in_stock_subscriptions b
         JOIN users u ON u.id = b.user_id WHERE b.product_id = ?`
      )
      .all(productId) as { user_id: number; email: string }[];
  },
};
