import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { cartDb, orderDb, promoDb, sellerDb } from "@/lib/db";
import { calcOrderTotal, calcShipping } from "@/lib/config";
import { validateName, validatePhone } from "@/lib/validators";
import type { Order } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
    orderDb.releaseExpiredReservations();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const city = searchParams.get("city") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    const orders =
      user.role === "customer"
        ? orderDb.listForUser(user.id)
        : user.role === "seller"
          ? orderDb.listForSeller(user.id, { status, city, from, to })
          : orderDb.listAll();

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["customer"]);
    const body = await request.json();
    const { name, phone, address, city, payMethod = "cod", promoCode } = body;

    if (!validateName(name)) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: "Please enter a valid Pakistan phone number." }, { status: 400 });
    }
    if (!address || String(address).trim().length < 5) {
      return NextResponse.json({ error: "Please enter a complete delivery address." }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ error: "Please enter your city." }, { status: 400 });
    }

    const cartItems = cartDb.list(user.id);
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    for (const item of cartItems) {
      if (item.qty > item.product.stock) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.product.name}.` },
          { status: 400 }
        );
      }
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    let discount = 0;
    let appliedPromo: string | null = null;
    if (promoCode) {
      const promo = promoDb.validate(String(promoCode));
      if (!promo) {
        return NextResponse.json({ error: "Invalid promo code." }, { status: 400 });
      }
      discount = Math.round(subtotal * (promo.discountPercent / 100));
      appliedPromo = promo.code;
    }
    const shippingFee = calcShipping(subtotal);
    const total = calcOrderTotal(subtotal, discount, shippingFee);
    const defaultSellerId = sellerDb.defaultSellerId();
    const sellerIds = [...new Set(cartItems.map((i) => i.product.sellerId ?? defaultSellerId).filter(Boolean))] as number[];
    if (sellerIds.length > 1) {
      return NextResponse.json({ error: "Cart contains products from multiple sellers. Split into separate orders." }, { status: 400 });
    }
    const now = new Date().toISOString();
    const cancellableUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const estimatedDeliveryAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const order: Order = {
      id: "ORD-" + Date.now().toString().slice(-6),
      userId: user.id,
      customerName: name,
      customerEmail: user.email,
      subtotal,
      shippingFee,
      discount,
      promoCode: appliedPromo,
      total,
      address: { name, phone, address, city },
      payMethod: payMethod === "card" ? "card" : "cod",
      status: payMethod === "card" ? "pending_payment" : "confirmed",
      trackingNumber: null,
      estimatedDeliveryAt,
      cancellableUntil,
      returnRequestedAt: null,
      sellerId: sellerIds[0] ?? null,
      items: cartItems.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
      })),
      createdAt: now,
      updatedAt: now,
    };

    orderDb.create(order);
    cartDb.clear(user.id);

    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to place order." }, { status: 500 });
  }
}
