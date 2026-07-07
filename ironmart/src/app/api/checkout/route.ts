import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cartDb, orderDb } from "@/lib/db";
import { calcShipping, SHIPPING_FEE, FREE_SHIPPING_MIN } from "@/lib/config";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

    const subtotal = user.role === "customer"
      ? cartDb.list(user.id).reduce((s, i) => s + i.product.price * i.qty, 0)
      : 0;

    return NextResponse.json({
      shippingFee: SHIPPING_FEE,
      freeShippingMin: FREE_SHIPPING_MIN,
      estimatedShipping: calcShipping(subtotal),
    });
  } catch {
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
    const { orderId } = await request.json();
    const order = orderDb.getById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (user.role === "customer" && order.userId !== user.id) {
      return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
