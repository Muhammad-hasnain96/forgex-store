"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/validators";
import { calcOrderTotal, calcShipping, FREE_SHIPPING_MIN, SHIPPING_FEE } from "@/lib/config";

export default function CheckoutPage() {
  const [subtotal, setSubtotal] = useState(0);
  const [payMethod, setPayMethod] = useState<"cod" | "card">("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const shippingFee = calcShipping(subtotal);
  const total = calcOrderTotal(subtotal, discount, shippingFee);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
    if (user && user.role !== "customer") router.replace("/");
    fetch("/api/cart").then((r) => r.json()).then((d) => setSubtotal(d.total ?? 0));
  }, [user, loading, router]);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Invalid promo.", "error");
      return;
    }
    setDiscount(data.discount);
    setAppliedPromo(data.code);
    showToast(`Promo ${data.code} applied (${data.discountPercent}% off).`);
  };

  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        phone: fd.get("phone"),
        address: fd.get("address"),
        city: fd.get("city"),
        payMethod,
        promoCode: appliedPromo || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Order failed.", "error");
      return;
    }
    router.push(`/confirmation/${data.order.id}`);
  };

  if (loading || !user) return null;

  return (
    <>
      <h2 className="section-title">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <form onSubmit={placeOrder}>
            <label>Full name</label>
            <input name="name" required placeholder="Your name" defaultValue={user.name} />
            <label>Phone</label>
            <input name="phone" required placeholder="03xx-xxxxxxx" />
            <label>Delivery address</label>
            <input name="address" required placeholder="House, street, area" />
            <label>City</label>
            <input name="city" required placeholder="City" />
            <label>Payment method</label>
            <div className="flex gap-3 mb-4">
              {(["cod", "card"] as const).map((m) => (
                <label key={m} className={`flex-1 border rounded p-3 text-center cursor-pointer text-sm ${payMethod === m ? "border-[var(--orange)] bg-[#fbe7d8]" : "border-[var(--border)]"}`}>
                  <input type="radio" className="w-auto mr-2" checked={payMethod === m} onChange={() => setPayMethod(m)} />
                  {m === "cod" ? "Cash on delivery" : "Card (demo)"}
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn-orange w-full">Place order — {formatPrice(total)}</button>
          </form>
        </div>
        <div className="card">
          <h3 className="mb-4">Order summary</h3>
          <div className="flex justify-between text-sm py-2 border-b border-[var(--border)]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm py-2 border-b border-[var(--border)]">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm py-2 border-b border-[var(--border)] text-green-700">
              <span>Discount ({appliedPromo})</span><span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold mt-4" style={{ fontFamily: "var(--font-oswald)" }}>
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">Free shipping on orders over {formatPrice(FREE_SHIPPING_MIN)}. Standard delivery {formatPrice(SHIPPING_FEE)}.</p>
          <label className="mt-6">Promo code</label>
          <div className="flex gap-2">
            <input value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. IRON10" className="mb-0! flex-1" />
            <button type="button" className="btn btn-outline btn-small" onClick={applyPromo}>Apply</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Try: IRON10, IRON20, WELCOME</p>
        </div>
      </div>
    </>
  );
}
