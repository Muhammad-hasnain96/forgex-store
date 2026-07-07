"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const { user, loading, refreshCart } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
    if (user && user.role !== "customer") router.replace("/");
  }, [user, loading, router]);

  const load = async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    }
  };

  useEffect(() => {
    if (user?.role === "customer") load();
  }, [user]);

  const changeQty = async (productId: string, qty: number) => {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Update failed.", "error");
    await refreshCart();
    await load();
  };

  if (loading || !user) return null;

  if (items.length === 0) {
    return (
      <>
        <h2 className="section-title">Your cart</h2>
        <div className="empty">Cart&apos;s empty. <Link href="/" className="text-[var(--orange-dark)]">Go browse products</Link>.</div>
      </>
    );
  }

  return (
    <>
      <h2 className="section-title">Your cart</h2>
      <div className="card">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-b-0">
            <div>
              <div className="font-semibold">{item.product.name}</div>
              <div className="text-sm text-[var(--steel)]">{formatPrice(item.product.price)} each</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-full border border-[var(--steel-dark)] bg-none cursor-pointer" onClick={() => changeQty(item.productId, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button className="w-7 h-7 rounded-full border border-[var(--steel-dark)] bg-none cursor-pointer" onClick={() => changeQty(item.productId, item.qty + 1)}>+</button>
            </div>
            <div className="font-semibold min-w-[90px] text-right">{formatPrice(item.product.price * item.qty)}</div>
          </div>
        ))}
        <div className="flex justify-between text-lg font-bold border-t-2 border-[var(--ink)] mt-2 pt-3" style={{ fontFamily: "var(--font-oswald)" }}>
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="text-right mt-5">
        <Link href="/checkout" className="btn btn-orange no-underline inline-block">Proceed to checkout</Link>
      </div>
    </>
  );
}
