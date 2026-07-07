"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import { OrderTracker } from "@/components/ui";
import type { Order } from "@/lib/types";

export default function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const placedId = searchParams.get("placed");

  const load = () => fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders ?? []));

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
    if (user) load();
  }, [user, loading, router]);

  const markReceived = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "delivered" }),
    });
    if (res.ok) {
      showToast("Order marked as received.");
      load();
    } else {
      const data = await res.json();
      showToast(data.error || "Update failed.", "error");
    }
  };

  const cancelOrder = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast("Order cancelled.");
      load();
    } else showToast(data.error || "Cancel failed.", "error");
  };

  const requestReturn = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "refunded" }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast("Return requested.");
      load();
    } else showToast(data.error || "Return request failed.", "error");
  };

  if (loading || !user) return null;

  return (
    <>
      <h2 className="section-title">{user.role === "customer" ? "My orders" : "All orders"}</h2>

      {placedId && (
        <div className="card text-center mb-8">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--green)] text-[var(--green)] flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
          <h2>Order placed</h2>
          <p className="subtle" style={{ marginLeft: 0 }}>Order {placedId} is confirmed.</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty">No orders yet. <Link href="/" className="text-[var(--orange-dark)]">Start shopping</Link>.</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border border-[var(--border)] rounded-md p-4 mb-4 bg-[#fffdf8]">
            <div className="flex justify-between text-sm text-[var(--steel)] border-b border-dashed border-[var(--border)] pb-2 mb-2">
              <span>{o.id} · {new Date(o.createdAt).toLocaleDateString()}</span>
              <span className={`badge badge-${o.status}`}>{o.status}</span>
            </div>
            {o.items.map((it) => (
              <div key={it.productId + it.qty} className="flex justify-between text-sm py-0.5">
                <span>{it.name} x{it.qty}</span>
                <span>{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
              {o.shippingFee > 0 && <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(o.shippingFee)}</span></div>}
              {o.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount {o.promoCode && `(${o.promoCode})`}</span><span>-{formatPrice(o.discount)}</span></div>}
            </div>
            <div className="flex justify-between font-bold border-t-2 border-[var(--ink)] mt-2 pt-2" style={{ fontFamily: "var(--font-oswald)" }}>
              <span>Total</span><span>{formatPrice(o.total)}</span>
            </div>
            <OrderTracker status={o.status} />
            {o.trackingNumber && (
              <div className="text-sm text-gray-600 mt-2">Tracking: <strong>{o.trackingNumber}</strong></div>
            )}
            {o.estimatedDeliveryAt && (
              <div className="text-sm text-gray-600">ETA: {new Date(o.estimatedDeliveryAt).toLocaleDateString()}</div>
            )}
            <div className="flex gap-2 justify-end mt-3 flex-wrap">
              <Link href={`/confirmation/${o.id}`} className="btn btn-outline btn-small no-underline">View receipt</Link>
              {user.role === "customer" && ["pending_payment", "confirmed"].includes(o.status) && (
                <button type="button" className="btn btn-outline btn-small" onClick={() => cancelOrder(o.id)}>Cancel order</button>
              )}
              {user.role === "customer" && o.status === "shipped" && (
                <button type="button" className="btn btn-orange btn-small" onClick={() => markReceived(o.id)}>Mark as received</button>
              )}
              {user.role === "customer" && o.status === "delivered" && (
                <button type="button" className="btn btn-outline btn-small" onClick={() => requestReturn(o.id)}>Request return</button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}
