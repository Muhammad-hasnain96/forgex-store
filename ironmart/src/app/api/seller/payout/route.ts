import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { sellerDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["seller", "admin"]);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || new Date().toISOString().slice(0, 7);
    const sellerId = user.role === "admin" ? Number(searchParams.get("sellerId")) || user.id : user.id;
    const report = sellerDb.payoutReport(sellerId, period);
    return NextResponse.json({
      ...report,
      periodStart: `${period}-01`,
      periodEnd: `${period}-31`,
      sellerId,
      sellerEmail: user.email,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Seller access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load payout report." }, { status: 500 });
  }
}

