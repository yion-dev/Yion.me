import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(request: NextRequest, sameOrigin = false): Promise<NextResponse | null> {
  const origin = request.headers.get("origin");
  if (sameOrigin && origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const cookie = request.headers.get("cookie") ?? "";
  if (!cookie.includes("session_token=")) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  try {
    const session = await fetch(`${process.env.BASE_URL || "http://localhost:8000"}/oauth/session`, {
      headers: { cookie }, cache: "no-store",
    });
    if (!session.ok) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Could not verify admin login" }, { status: 503 });
  }

  return null;
}
