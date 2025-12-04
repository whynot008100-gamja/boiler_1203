import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase 세션 업데이트 미들웨어
 * 
 * 공식 문서 모범 사례에 따른 구현:
 * https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * 
 * Server Components는 쿠키를 쓸 수 없으므로, 미들웨어에서 세션을 갱신합니다.
 * 만료된 Auth 토큰을 자동으로 갱신하여 Server Components에 전달합니다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Supabase 환경 변수가 없으면 Supabase 세션 갱신을 건너뜀
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (만료된 토큰 자동 갱신)
  // ⚠️ 주의: getSession()이 아닌 getUser()를 사용해야 합니다.
  // getSession()은 토큰을 재검증하지 않을 수 있습니다.
  try {
    await supabase.auth.getUser();
  } catch (error) {
    // Supabase 인증 오류는 무시 (Clerk만 사용하는 경우)
    console.warn("Supabase session update failed:", error);
  }

  return supabaseResponse;
}

