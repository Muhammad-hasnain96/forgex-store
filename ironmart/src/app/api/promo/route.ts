import { NextResponse } from "next/server";
import { promoDb } from "@/lib/db";
import { calcShipping } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return NextResponse.json({ error: "Enter a promo code." }, { status: 400 });
    const sub = Number(subtotal) || 0;
    const promo = promoDb.validate(String(code));
    if (!promo) return NextResponse.json({ error: "Invalid or expired promo code." }, { status: 400 });
    const discount = Math.round(sub * (promo.discountPercent / 100));
    const shippingFee = calcShipping(sub);
    const total = Math.max(0, sub - discount + shippingFee);
    return NextResponse.json({
      code: promo.code,
      discountPercent: promo.discountPercent,
      discount,
      shippingFee,
      total,
    });
  } catch {
    return NextResponse.json({ error: "Failed to validate promo." }, { status: 500 });
  }
}
