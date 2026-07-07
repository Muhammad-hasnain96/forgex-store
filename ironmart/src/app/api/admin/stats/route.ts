import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { productDb, statsDb } from "@/lib/db";
import { LOW_STOCK_THRESHOLD } from "@/lib/config";

export async function GET() {
  try {
    requireRole(await getCurrentUser(), ["admin"]);
    const stats = statsDb.adminStats();
    const lowStock = productDb.listLowStock(LOW_STOCK_THRESHOLD);
    return NextResponse.json({ stats, lowStock });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load stats." }, { status: 500 });
  }
}
