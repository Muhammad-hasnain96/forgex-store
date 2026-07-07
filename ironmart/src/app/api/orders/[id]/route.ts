import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { orderDb } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

    const { id } = await params;
    const { status, trackingNumber, estimatedDeliveryAt } = await request.json() as {
      status: OrderStatus;
      trackingNumber?: string;
      estimatedDeliveryAt?: string;
    };
    const order = orderDb.getById(id);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (status === "cancelled" && user.role === "customer" && order.userId === user.id) {
      if (!order.cancellableUntil || new Date(order.cancellableUntil).getTime() < Date.now()) {
        return NextResponse.json({ error: "Cancel window has expired." }, { status: 400 });
      }
      if (!["pending_payment", "confirmed"].includes(order.status)) {
        return NextResponse.json({ error: "Order cannot be cancelled now." }, { status: 400 });
      }
      orderDb.updateStatus(id, "cancelled");
      return NextResponse.json({ ok: true, status: "cancelled" });
    }

    if (status === "delivered" && user.role === "customer" && order.userId === user.id) {
      if (order.status !== "shipped") {
        return NextResponse.json({ error: "Order is not shipped yet." }, { status: 400 });
      }
      orderDb.updateStatus(id, "delivered");
      return NextResponse.json({ ok: true, status: "delivered" });
    }

    if (status === "refunded" && user.role === "customer" && order.userId === user.id) {
      if (order.status !== "delivered") {
        return NextResponse.json({ error: "Return request only after delivery." }, { status: 400 });
      }
      const deliveredAt = new Date(order.updatedAt).getTime();
      if (Date.now() - deliveredAt > 7 * 24 * 60 * 60 * 1000) {
        return NextResponse.json({ error: "Return window (7 days) expired." }, { status: 400 });
      }
      orderDb.markReturnRequested(id);
      return NextResponse.json({ ok: true, status: "refunded" });
    }

    if (user.role === "seller") {
      if (order.sellerId !== user.id) {
        return NextResponse.json({ error: "Order does not belong to your seller account." }, { status: 403 });
      }
      if (status === "packed" && order.status === "confirmed") {
        orderDb.updateStatus(id, "packed");
        return NextResponse.json({ ok: true, status: "packed" });
      }
      if (status === "shipped" && ["confirmed", "packed"].includes(order.status)) {
        orderDb.updateStatus(id, "shipped", { trackingNumber, estimatedDeliveryAt });
        return NextResponse.json({ ok: true, status: "shipped" });
      }
      return NextResponse.json({ error: "Invalid seller transition." }, { status: 400 });
    }

    if (user.role === "admin") {
      orderDb.updateStatus(id, status);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
