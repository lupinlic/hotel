import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    // Gọi API để kiểm tra user
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Invalid token");
    }

    const data = await res.json();
    if (data.user.role !== "admin") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

export const runtime = 'nodejs';