import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_jwt_secret_must_be_long_and_secure_minimum_32_characters"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes, except admin/login and assets
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      // Redirect to admin login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify JWT
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (e) {
      console.warn("Invalid admin session:", e);
      // Redirect with session cleanup
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

// Ensure proxy runs only on admin subpaths
export const config = {
  matcher: ["/admin/:path*"],
};
