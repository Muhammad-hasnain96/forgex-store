"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/validators";
import type { Order } from "@/lib/types";

export default function ConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
    if (orderId) {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
        .then((r) => r.json())
        .then((d) => setOrder(d.order ?? null));
    }
  }, [orderId, user, loading, router]);

  const printReceipt = () => window.print();

  if (loading || !order) return null;

  return (
    <div className="confirmation-print">
      <div className="card text-center max-w-lg mx-auto mb-8">
        <div className="w-16 h-16 rounded-full border-4 border-[var(--green)] text-[var(--green)] flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
        <h2 className="text-2xl mb-2">Order confirmed</h2>
        <p className="text-gray-600 mb-6">Thank you, {order.customerName}. Order <strong>{order.id}</strong> is {order.status.replace("_", " ")}.</p>
        <div className="text-left text-sm space-y-2 mb-6 border-t border-[var(--border)] pt-4">
          {order.items.map((it) => (
            <div key={it.productId + it.qty} className="flex justify-between">
              <span>{it.name} × {it.qty}</span>
              <span>{formatPrice(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          <p className="text-gray-500 pt-2">Deliver to: {order.address.address}, {order.address.city} · {order.address.phone}</p>
          <p className="text-gray-500">Payment: {order.payMethod === "cod" ? "Cash on delivery" : "Card"}</p>
        </div>
        <div className="flex gap-3 justify-center no-print">
          <button type="button" className="btn btn-outline" onClick={printReceipt}>Print receipt</button>
          <Link href="/orders" className="btn btn-orange no-underline">My orders</Link>
          <Link href="/" className="btn no-underline">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
