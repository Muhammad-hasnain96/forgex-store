"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import type { AdminStats, Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";

const CATEGORIES = [
  "Ladies Shalwar Kameez", "Gents Shalwar Kameez", "Ladies Kurtas", "Gents Kurtas",
  "Formal & Wedding", "Unstitched Fabric", "Dupatta & Shawl",
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const load = () => {
    fetch("/api/products?inStock=false", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []));
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setLowStock(d.lowStock ?? []);
      });
  };

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth");
      else if (user.role !== "admin") router.replace("/");
      else load();
    }
  }, [user, loading, router]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      showToast(data.error || "Upload failed.", "error");
      return;
    }
    const input = document.querySelector<HTMLInputElement>('input[name="image"]');
    if (input) input.value = data.url;
    showToast("Image uploaded.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const body = {
      name: fd.get("name"),
      price: Number(fd.get("price")),
      category: fd.get("category"),
      stock: Number(fd.get("stock")),
      rating: Number(fd.get("rating")),
      reviews: Number(fd.get("reviews")),
      description: fd.get("description"),
      image: fd.get("image"),
    };

    const res = editing
      ? await fetch(`/api/products/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Save failed.", "error");
      return;
    }
    showToast(editing ? "Product updated." : "Product added.");
    setEditing(null);
    formEl.reset();
    load();
  };

  const startEdit = (p: Product) => {
    setEditing(p.id);
    setTimeout(() => {
      const form = document.getElementById("admin-form") as HTMLFormElement;
      if (!form) return;
      (form.elements.namedItem("name") as HTMLInputElement).value = p.name;
      (form.elements.namedItem("price") as HTMLInputElement).value = String(p.price);
      (form.elements.namedItem("category") as HTMLSelectElement).value = p.category;
      (form.elements.namedItem("stock") as HTMLInputElement).value = String(p.stock);
      (form.elements.namedItem("rating") as HTMLInputElement).value = String(p.rating);
      (form.elements.namedItem("reviews") as HTMLInputElement).value = String(p.reviews);
      (form.elements.namedItem("description") as HTMLTextAreaElement).value = p.description;
      (form.elements.namedItem("image") as HTMLInputElement).value = p.image;
    }, 0);
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, { method: "DELETE", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(data.error || "Delete failed.", "error");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editing === id) setEditing(null);
    showToast(`"${name}" deleted.`);
    load();
  };

  if (loading || !user) return null;

  return (
    <>
      <h2 className="section-title">Admin dashboard</h2>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "In-stock products", value: stats.productCount },
            { label: "Low stock alerts", value: stats.lowStockCount },
            { label: "Orders today", value: stats.ordersToday },
            { label: "Total revenue", value: formatPrice(stats.revenueTotal) },
          ].map((s) => (
            <div key={s.label} className="card text-center py-4">
              <div className="text-2xl font-bold text-[var(--orange)]">{s.value}</div>
              <div className="text-xs uppercase text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="card mb-8 border-l-4 border-[var(--orange)]">
          <h3 className="mb-3 text-[var(--orange-dark)]">Low stock alert</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 8).map((p) => (
              <span key={p.id} className="text-sm bg-[#fff4e0] px-3 py-1 rounded-full">{p.name} ({p.stock})</span>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="mb-4">{editing ? "Edit product" : "Add product"}</h3>
          <form id="admin-form" onSubmit={handleSubmit}>
            <label>Product name</label>
            <input name="name" required />
            <label>Price (Rs.)</label>
            <input name="price" type="number" required />
            <div className="grid grid-cols-2 gap-4">
              <div><label>Category</label><select name="category" required><option value="">Select</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label>Stock</label><input name="stock" type="number" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label>Rating</label><input name="rating" type="number" step="0.1" min="0" max="5" defaultValue="4.5" required /></div>
              <div><label>Reviews</label><input name="reviews" type="number" defaultValue="0" required /></div>
            </div>
            <label>Description</label>
            <textarea name="description" required rows={3} />
            <label>Image URL, emoji, or upload</label>
            <input name="image" placeholder="👗 or https://... or /uploads/..." required />
            <label className="mt-2">Upload image file</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn btn-orange flex-1">{editing ? "Update" : "Add"} product</button>
              {editing && <button type="button" className="btn btn-outline flex-1" onClick={() => { setEditing(null); (document.getElementById("admin-form") as HTMLFormElement)?.reset(); }}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="card">
          <h3 className="mb-4">Products ({products.length})</h3>
          <div className="max-h-[500px] overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-4 border-b border-[var(--paper-dim)] gap-3">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span className="w-8 h-8 shrink-0 overflow-hidden rounded"><ProductImage image={p.image} alt={p.name} className="w-8 h-8 object-cover" emojiClassName="text-lg" /></span>
                    {p.name} {p.stock === 0 && <span className="text-xs text-red-600">OUT</span>}
                  </div>
                  <div className="text-xs text-gray-500">{formatPrice(p.price)} | {p.category} | Stock: {p.stock}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" className="btn btn-small" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="btn btn-small" style={{ background: "#c33" }} onClick={() => deleteProduct(p.id, p.name)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
