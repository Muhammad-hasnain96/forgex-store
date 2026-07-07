"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import { OrderTracker } from "@/components/ui";
import type { Order } from "@/lib/types";

export default function SellerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [payout, setPayout] = useState<{ grossSales: number; commissionAmount: number; netPayout: number } | null>(null);
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const load = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (cityFilter) params.set("city", cityFilter);
    fetch(`/api/orders?${params.toString()}`).then((r) => r.json()).then((d) => setOrders(d.orders ?? []));
    fetch("/api/seller/payout").then((r) => r.json()).then((d) => setPayout(d));
  };

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth");
      else if (user.role !== "seller" && user.role !== "admin") router.replace("/");
      else load();
    }
  }, [user, loading, router, statusFilter, cityFilter]);

  const moveStatus = async (id: string, status: "packed" | "shipped") => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        trackingNumber: tracking[id] || undefined,
        estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
    if (res.ok) {
      showToast(`Order marked as ${status}.`);
      load();
    } else {
      const data = await res.json();
      showToast(data.error || "Update failed.", "error");
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <h2 className="section-title">Incoming orders</h2>
      <p className="subtle">Ship placed orders and track delivery status.</p>
      {payout && (
        <div className="card mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-xs text-gray-500">Gross</div><div className="font-bold">{formatPrice(payout.grossSales || 0)}</div></div>
            <div><div className="text-xs text-gray-500">Commission</div><div className="font-bold">{formatPrice(payout.commissionAmount || 0)}</div></div>
            <div><div className="text-xs text-gray-500">Net payout</div><div className="font-bold text-green-700">{formatPrice(payout.netPayout || 0)}</div></div>
          </div>
        </div>
      )}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input placeholder="Filter by city" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="empty">No orders yet.</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border border-[var(--border)] rounded-md p-4 mb-4 bg-white">
            <div className="flex justify-between text-sm text-[var(--steel)] border-b border-dashed border-[var(--border)] pb-2 mb-2">
              <span>{o.id} · {o.customerName} · {new Date(o.createdAt).toLocaleDateString()}</span>
              <span className={`badge badge-${o.status}`}>{o.status}</span>
            </div>
            {o.items.map((it) => (
              <div key={it.productId} className="flex justify-between text-sm py-0.5">
                <span>{it.name} x{it.qty}</span>
                <span>{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="text-sm text-[var(--steel)] mt-2">
              Deliver to: {o.address.address}, {o.address.city} · {o.address.phone} · Pay: {o.payMethod === "cod" ? "COD" : "Card"}
            </div>
            {o.status !== "delivered" && o.status !== "cancelled" && o.status !== "refunded" && (
              <div className="mt-2">
                <label className="text-xs">Tracking number</label>
                <input
                  value={tracking[o.id] ?? o.trackingNumber ?? ""}
                  onChange={(e) => setTracking((prev) => ({ ...prev, [o.id]: e.target.value }))}
                  placeholder="e.g. TRK-123456"
                />
              </div>
            )}
            <OrderTracker status={o.status} />
            {(o.status === "confirmed" || o.status === "packed") && (
              <div className="text-right flex gap-2 justify-end">
                {o.status === "confirmed" && (
                  <button className="btn btn-outline btn-small" onClick={() => moveStatus(o.id, "packed")}>Mark packed</button>
                )}
                <button className="btn btn-orange btn-small" onClick={() => moveStatus(o.id, "shipped")}>Mark shipped</button>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
