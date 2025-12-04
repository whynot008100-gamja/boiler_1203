import { clerkMiddleware } from "@clerk/nextjs/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware
 *
 * Clerk와 Supabase 세션 관리를 모두 처리합니다.
 *
 * 1. Clerk 인증 미들웨어 실행
 * 2. Supabase 세션 갱신 (만료된 토큰 자동 갱신)
 *
 * 참고:
 * - Clerk는 사용자 인증을 처리합니다
 * - Supabase는 데이터베이스 접근을 위한 세션을 관리합니다
 * - 두 시스템은 독립적으로 작동하며, Clerk를 third-party auth provider로 사용할 수 있습니다
 */
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Supabase 세션 갱신
  const supabaseResponse = await updateSession(request);

  // Clerk와 Supabase 응답 병합
  // Clerk는 자동으로 처리되며, Supabase 쿠키도 함께 반환됩니다
  return supabaseResponse;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
