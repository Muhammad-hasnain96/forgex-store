import { NextResponse } from "next/server";

const ALLOWED = /^https?:\/\//i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url");
  if (!raw || !ALLOWED.test(raw.trim())) {
    return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
  }

  const url = raw.trim();

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ForgeX/1.0)",
        Accept: "image/*",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Image not found." }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load image." }, { status: 502 });
  }
}
