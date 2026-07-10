"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, cartCount, logout } = useAuth();

  return (
    <header
      className="text-[var(--paper)] border-b-4 border-[var(--orange)] shadow-lg"
      style={{ background: "linear-gradient(135deg, var(--steel-dark) 0%, #0f1419 100%)" }}
    >
      <div className="top-strip">
        <span>Pakistani fashion for ladies &amp; gents</span>
        <span>Mon-Sat 9:00 AM - 7:00 PM</span>
        <span>Support: +92-300-1234567</span>
      </div>
      <div className="main-row">
        <Link href="/" className="brand text-[28px] text-[var(--paper)] no-underline tracking-wider flex items-baseline gap-2">
          <span>Silk<span className="text-[var(--orange)] text-[32px]">Lane</span></span>
          <span className="tagline">Pakistani Fashion</span>
        </Link>
        <nav className="nav-wrap">
          <Link href="/" className="nav-btn">Shop</Link>
          {user?.role === "admin" && <Link href="/admin" className="nav-btn">Admin</Link>}
          {user?.role === "seller" && <Link href="/seller" className="nav-btn">Seller Desk</Link>}
          {(!user || user.role === "customer") && (
            <>
              {user && <Link href="/wishlist" className="nav-btn">Wishlist</Link>}
              {user && <Link href="/orders" className="nav-btn">My Orders</Link>}
              <Link href="/cart" className="nav-btn cart-btn">Cart ({cartCount})</Link>
            </>
          )}
          {user ? (
            <button type="button" className="nav-btn" onClick={() => logout()}>Logout</button>
          ) : (
            <Link href="/auth" className="nav-btn">Login</Link>
          )}
        </nav>
      </div>
      <style jsx>{`
        .top-strip {
          padding: 8px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
        }
        .main-row {
          padding: 18px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .nav-wrap {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .nav-btn {
          background: transparent;
          border: 1px solid rgba(242, 236, 224, 0.45);
          color: var(--paper);
          padding: 9px 14px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .nav-btn:hover {
          background: var(--orange);
          border-color: var(--orange);
          color: white;
          transform: translateY(-1px);
        }
        .cart-btn {
          border-color: var(--orange);
          color: var(--orange);
          font-weight: 700;
        }
        .cart-btn:hover {
          background: var(--orange);
          color: white;
        }
        @media (max-width: 900px) {
          .top-strip {
            display: none;
          }
          .tagline {
            display: none;
          }
        }
        .tagline {
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 600;
        }
      `}</style>
    </header>
  );
}
