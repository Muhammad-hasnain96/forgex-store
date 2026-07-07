"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login, signup, user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    const dest = user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller" : "/";
    router.replace(dest);
  }, [user, loading, router]);

  if (loading || user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (mode === "login") {
      const result = await login(String(fd.get("email")), String(fd.get("password")));
      if ("error" in result) showToast(result.error, "error");
      else {
        showToast("Welcome back!");
        const role = result.user.role;
        router.push(role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/");
      }
    } else {
      const result = await signup(String(fd.get("name")), String(fd.get("email")), String(fd.get("password")));
      if ("error" in result) showToast(result.error, "error");
      else {
        showToast("Account created!");
        router.push("/");
      }
    }
  };

  return (
    <>
      <h2 className="section-title">{mode === "login" ? "Log in" : "Create account"}</h2>
      <div className="card max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label>Full name</label>
              <input name="name" placeholder="Your full name" required />
            </>
          )}
          <label>Email</label>
          <input name="email" type="email" placeholder="name@example.com" required />
          <label>Password</label>
          <input name="password" type="password" placeholder="At least 6 characters" required minLength={6} />
          <button type="submit" className="btn btn-orange w-full">{mode === "login" ? "Log in" : "Sign up"}</button>
        </form>
        <p className="text-center text-sm mt-4 text-[var(--steel)]">
          {mode === "login" ? (
            <>New here? <button className="text-[var(--orange-dark)] underline bg-none border-none cursor-pointer" onClick={() => setMode("signup")}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="text-[var(--orange-dark)] underline bg-none border-none cursor-pointer" onClick={() => setMode("login")}>Log in</button></>
          )}
        </p>
        <div className="text-xs text-center mt-5 pt-4 border-t border-[var(--border)] text-gray-600">
          <strong>Demo accounts</strong><br />
          Customer: demo@example.com / demo123<br />
          Seller: seller@ironmart.com / seller123<br />
          Admin: admin@ironmart.com / admin123
        </div>
      </div>
    </>
  );
}
