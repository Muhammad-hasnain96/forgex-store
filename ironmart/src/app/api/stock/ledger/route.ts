import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { stockDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    requireRole(await getCurrentUser(), ["admin", "seller"]);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const entries = stockDb.ledger(productId);
    return NextResponse.json({ entries });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load stock ledger." }, { status: 500 });
  }
}

