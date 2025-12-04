import { clerkMiddleware } from "@clerk/nextjs/server";
import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

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
  const supabaseResponse = await updateSession(request);
  return supabaseResponse;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
