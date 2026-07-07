"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product, ProductSort } from "@/lib/types";
import { formatPrice } from "@/lib/validators";
import { StarRating, StockBadge } from "@/components/ui";
import ProductImage from "@/components/ProductImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<ProductSort>("name");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const { user, refreshCart } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category))).sort()];

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadWishlist = useCallback(async () => {
    if (!user || user.role !== "customer") {
      setWishlistIds(new Set());
      return;
    }
    const res = await fetch("/api/wishlist");
    if (res.ok) {
      const data = await res.json();
      setWishlistIds(new Set(data.ids ?? []));
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category !== "all") params.set("category", category);
    params.set("sort", sort);
    params.set("inStock", showOutOfStock ? "false" : "true");
    fetch(`/api/products?${params}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []));
  }, [debouncedSearch, category, sort, showOutOfStock]);

  const addToCart = async (productId: string) => {
    if (!user) {
      showToast("Log in to add items to your cart.", "error");
      router.push("/auth");
      return;
    }
    if (user.role !== "customer") {
      showToast("Only customers can shop.", "error");
      return;
    }
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to add to cart.", "error");
      return;
    }
    await refreshCart();
    showToast("Added to cart.");
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      showToast("Log in to save wishlist items.", "error");
      router.push("/auth");
      return;
    }
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Wishlist update failed.", "error");
      return;
    }
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (data.added) next.add(productId);
      else next.delete(productId);
      return next;
    });
    showToast(data.added ? "Added to wishlist." : "Removed from wishlist.");
  };

  const subscribeBackInStock = async (productId: string) => {
    const res = await fetch("/api/stock/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Subscription failed.", "error");
    else showToast("You will be notified when item is back in stock.");
  };

  return (
    <>
      <div
        className="text-white text-center p-14 rounded-xl mb-12 shadow-lg"
        style={{ background: "linear-gradient(135deg, var(--steel-dark) 0%, #252d34 50%, var(--orange) 100%)" }}
      >
        <h1 className="text-4xl mb-3">Built for the job site</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Tools, plumbing, paint, and fasteners — shipped across Pakistan.</p>
      </div>

      <h2 className="section-title">Browse products</h2>
      <p className="subtle">Everything for the workshop, the toolbox, and the job site.</p>

      <div className="flex flex-wrap gap-4 mb-7 bg-white p-5 rounded-xl shadow-sm">
        <input
          className="flex-1 min-w-[200px] mb-0!"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="w-auto min-w-[150px] mb-0!" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
          ))}
        </select>
        <select className="w-auto min-w-[150px] mb-0!" value={sort} onChange={(e) => setSort(e.target.value as ProductSort)}>
          <option value="name">Sort: Name</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="rating">Top rated</option>
          <option value="newest">Newest</option>
        </select>
        <label className="flex items-center gap-2 text-sm mb-0!">
          <input type="checkbox" className="w-auto mb-0!" checked={showOutOfStock} onChange={(e) => setShowOutOfStock(e.target.checked)} />
          Show out-of-stock
        </label>
      </div>

      {products.length === 0 ? (
        <div className="empty">No products found.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[var(--border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:-translate-y-2 hover:border-[var(--orange)] transition-all"
            >
              <div className="h-40 rounded-lg bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] flex items-center justify-center border-2 border-[#f0f0f0] overflow-hidden cursor-pointer" onClick={() => setSelected(p)}>
                <ProductImage image={p.image} alt={p.name} />
              </div>
              <span className="text-[11px] uppercase font-bold text-white bg-[var(--orange)] px-2.5 py-1 rounded-md w-fit">{p.category}</span>
              <div className="font-bold text-[var(--steel-dark)]">{p.name}</div>
              <StarRating rating={p.rating} />
              <StockBadge stock={p.stock} />
              <div className="text-xl font-bold text-[var(--orange)]" style={{ fontFamily: "var(--font-oswald)" }}>{formatPrice(p.price)}</div>
              <div className="flex gap-2">
                {p.stock > 0 ? (
                  <button type="button" className="btn btn-orange btn-small flex-1" onClick={() => addToCart(p.id)}>Add to cart</button>
                ) : (
                  <button type="button" className="btn btn-outline btn-small flex-1" onClick={() => subscribeBackInStock(p.id)}>Notify me</button>
                )}
                <button
                  type="button"
                  className={`btn btn-small w-11 ${wishlistIds.has(p.id) ? "btn-orange" : "btn-outline"}`}
                  onClick={() => toggleWishlist(p.id)}
                  title="Wishlist"
                >
                  ♥
                </button>
              </div>
              <button type="button" className="btn btn-outline btn-small w-full" onClick={() => setSelected(p)}>View details</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[var(--orange)] bg-none border-none cursor-pointer" onClick={() => setSelected(null)}>✕</button>
            <div className="flex justify-center mb-4 min-h-[200px]">
              <ProductImage image={selected.image} alt={selected.name} className="max-h-[250px] w-full object-contain rounded-lg" emojiClassName="text-8xl" />
            </div>
            <h2 className="text-2xl mb-2">{selected.name}</h2>
            <StarRating rating={selected.rating} />
            <div className="text-3xl font-bold text-[var(--orange)] my-3" style={{ fontFamily: "var(--font-oswald)" }}>{formatPrice(selected.price)}</div>
            <StockBadge stock={selected.stock} />
            <p className="text-gray-600 my-4 leading-relaxed">{selected.description}</p>
            <div className="flex gap-2">
              {selected.stock > 0 ? (
                <button type="button" className="btn btn-orange flex-1" onClick={() => { addToCart(selected.id); setSelected(null); }}>Add to cart</button>
              ) : (
                <button type="button" className="btn btn-outline flex-1" onClick={() => subscribeBackInStock(selected.id)}>Notify when in stock</button>
              )}
              <button type="button" className="btn btn-outline" onClick={() => toggleWishlist(selected.id)}>{wishlistIds.has(selected.id) ? "♥ Saved" : "♥ Wishlist"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
