import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { productDb } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = requireRole(await getCurrentUser(), ["admin", "seller"]);
    const { id } = await params;
    const body = await request.json();
    const existing = productDb.getById(id);
    if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    if (user.role === "seller" && existing.sellerId !== user.id) {
      return NextResponse.json({ error: "You can only edit your own products." }, { status: 403 });
    }

    const updated = {
      name: body.name ?? existing.name,
      sellerId: existing.sellerId ?? (user.role === "seller" ? user.id : null),
      price: Number(body.price ?? existing.price),
      category: body.category ?? existing.category,
      stock: Number(body.stock ?? existing.stock),
      rating: Number(body.rating ?? existing.rating),
      reviews: Number(body.reviews ?? existing.reviews),
      description: body.description ?? existing.description,
      image: body.image != null ? String(body.image).trim() : existing.image,
    };

    productDb.update(id, updated);
    return NextResponse.json({ product: { id, ...updated } });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = requireRole(await getCurrentUser(), ["admin", "seller"]);
    const { id } = await params;
    const existing = productDb.getById(id);
    if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (user.role === "seller" && existing.sellerId !== user.id) {
      return NextResponse.json({ error: "You can only delete your own products." }, { status: 403 });
    }
    productDb.delete(id);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    console.error("Delete product failed:", e);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
