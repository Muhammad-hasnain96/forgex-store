export function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-1 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? "#ffc107" : i === full && half ? "#ffc107" : "#ddd" }}>
          ★
        </span>
      ))}
      <span className="ml-1 font-semibold">{rating}</span>
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 5) return <span className="text-xs px-3 py-1 rounded-lg font-bold bg-[#ffe0e0] text-[#c33]">Low stock ({stock})</span>;
  if (stock <= 20) return <span className="text-xs px-3 py-1 rounded-lg font-bold bg-[#fff4e0] text-[#a84]">{stock} left</span>;
  return <span className="text-xs px-3 py-1 rounded-lg font-bold bg-[#e0ffe0] text-[#3a3]">In stock</span>;
}

export function OrderTracker({
  status,
}: {
  status:
    | "pending_payment"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
}) {
  const stages = ["pending_payment", "confirmed", "packed", "shipped", "delivered"] as const;
  const idx = stages.indexOf(status as (typeof stages)[number]);
  const labels = {
    pending_payment: "Pending pay",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
  };
  const icons = { pending_payment: "⏳", confirmed: "✅", packed: "📦", shipped: "🚚", delivered: "🏠" };

  if (status === "cancelled" || status === "refunded") {
    return (
      <div className="my-4 text-sm font-semibold text-red-600">
        {status === "cancelled" ? "Order cancelled" : "Return requested / refunded"}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center my-6 relative">
      {stages.map((s, i) => (
        <div key={s} className="flex flex-col items-center gap-1 flex-1 z-10">
          <div
            className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center text-sm ${
              i < idx ? "border-[var(--green)] text-[var(--green)] bg-[#eaf3ea]" :
              i === idx ? "border-[var(--orange)] text-[var(--orange-dark)] bg-[#fbe7d8]" :
              "border-[var(--border)] text-[var(--border)] bg-[var(--paper)]"
            }`}
          >
            {i <= idx ? icons[s] : ""}
          </div>
          <span className="text-[11px] uppercase tracking-wide text-[var(--steel)] text-center">{labels[s]}</span>
        </div>
      ))}
    </div>
  );
}
