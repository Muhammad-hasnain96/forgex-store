import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { wishlistDb } from "@/lib/db";

export async function GET() {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const products = wishlistDb.list(user.id);
    const ids = products.map((p) => p.id);
    return NextResponse.json({ products, ids, count: products.length });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load wishlist." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: "Product ID required." }, { status: 400 });
    const added = wishlistDb.toggle(user.id, productId);
    return NextResponse.json({ added, count: wishlistDb.count(user.id) });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update wishlist." }, { status: 500 });
  }
}
