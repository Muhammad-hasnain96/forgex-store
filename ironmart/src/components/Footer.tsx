import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-20 px-8 pt-14 pb-8 text-[var(--paper)]"
      style={{ background: "linear-gradient(135deg, var(--steel-dark) 0%, #0f1419 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <h3 className="text-[var(--orange)] text-sm mb-4">SilkLane</h3>
          <p className="text-sm opacity-70 mb-4">Premium shalwar kameez, kurtas, and formal wear for every occasion.</p>
          <p className="text-xs opacity-60 leading-6">Secure checkout • Seller fulfilment • Nationwide delivery</p>
        </div>
        <div>
          <h3 className="text-[var(--orange)] text-sm mb-4">Customer</h3>
          <Link href="/" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Shop</Link>
          <Link href="/auth" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Account</Link>
          <Link href="/contact" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Contact</Link>
          <Link href="/wishlist" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline">Wishlist</Link>
        </div>
        <div>
          <h3 className="text-[var(--orange)] text-sm mb-4">Business</h3>
          <Link href="/seller" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Seller desk</Link>
          <Link href="/admin" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Admin panel</Link>
          <p className="text-sm opacity-70">Email: support@silklane.pk</p>
          <p className="text-sm opacity-70">Phone: +92-300-1234567</p>
        </div>
        <div>
          <h3 className="text-[var(--orange)] text-sm mb-4">Legal</h3>
          <Link href="/privacy" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Privacy policy</Link>
          <Link href="/terms" className="block text-sm opacity-70 hover:text-[var(--orange)] no-underline mb-2">Terms &amp; conditions</Link>
          <p className="text-sm opacity-70">Returns: within 7 days (unworn, tags attached)</p>
        </div>
      </div>
      <div className="border-t border-white/20 pt-6 text-xs opacity-50 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} SilkLane — Pakistani Fashion</span>
        <span>Trusted online clothing store across Pakistan</span>
      </div>
    </footer>
  );
}
