import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { notifyDb, productDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const { productId } = await request.json();
    const product = productDb.getById(productId);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    notifyDb.subscribeBackInStock(user.id, productId);
    return NextResponse.json({ ok: true, message: "Back-in-stock alert subscribed." });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
  }
}

