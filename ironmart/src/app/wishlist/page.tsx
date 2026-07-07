"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import { StarRating, StockBadge } from "@/components/ui";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user, loading, refreshCart } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const load = () => fetch("/api/wishlist").then((r) => r.json()).then((d) => setProducts(d.products ?? []));

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
    if (user?.role === "customer") load();
  }, [user, loading, router]);

  const remove = async (id: string) => {
    await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: id }) });
    load();
    showToast("Removed from wishlist.");
  };

  const addToCart = async (id: string) => {
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: id }) });
    if (res.ok) {
      await refreshCart();
      showToast("Added to cart.");
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <h2 className="section-title">My wishlist</h2>
      {products.length === 0 ? (
        <div className="empty"><Link href="/" className="text-[var(--orange-dark)]">Browse products</Link> to save favourites.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {products.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3">
              <div className="h-36 overflow-hidden rounded-lg"><ProductImage image={p.image} alt={p.name} /></div>
              <div className="font-bold">{p.name}</div>
              <StarRating rating={p.rating} />
              <StockBadge stock={p.stock} />
              <div className="font-bold text-[var(--orange)]">{formatPrice(p.price)}</div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-orange btn-small flex-1" onClick={() => addToCart(p.id)}>Add to cart</button>
                <button type="button" className="btn btn-outline btn-small" onClick={() => remove(p.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
