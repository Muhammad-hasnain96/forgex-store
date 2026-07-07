import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { cartDb, productDb } from "@/lib/db";

export async function GET() {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const items = cartDb.list(user.id);
    const count = cartDb.count(user.id);
    const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    return NextResponse.json({ items, count, total });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load cart." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const { productId, qty = 1 } = await request.json();
    const product = productDb.getById(productId);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const existing = cartDb.list(user.id).find((i) => i.productId === productId);
    const newQty = (existing?.qty ?? 0) + Number(qty);
    if (newQty > product.stock) {
      return NextResponse.json({ error: "Not enough stock available." }, { status: 400 });
    }

    cartDb.upsert(user.id, productId, newQty);
    return NextResponse.json({ ok: true, count: cartDb.count(user.id) });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update cart." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const { productId, qty } = await request.json();
    const product = productDb.getById(productId);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (qty > product.stock) {
      return NextResponse.json({ error: "Not enough stock available." }, { status: 400 });
    }
    cartDb.upsert(user.id, productId, Number(qty));
    return NextResponse.json({ ok: true, count: cartDb.count(user.id) });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update cart." }, { status: 500 });
  }
}
