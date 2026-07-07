import { NextResponse } from "next/server";
import { authenticate, createSession, getCurrentUser, setSessionCookie } from "@/lib/auth";
import { userDb } from "@/lib/db";
import { validateEmail, validateName, validatePassword } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required." }, { status: 400 });
      }
      const user = await authenticate(email, password);
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      const token = await createSession(user);
      await setSessionCookie(token);
      return NextResponse.json({ user });
    }

    if (action === "signup") {
      const { name, email, password } = body;
      if (!validateName(name)) {
        return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
      }
      if (!validateEmail(email)) {
        return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
      }
      if (!validatePassword(password)) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      if (userDb.findByEmail(email)) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      const user = await userDb.create(name, email, password);
      const token = await createSession(user);
      await setSessionCookie(token);
      return NextResponse.json({ user }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
