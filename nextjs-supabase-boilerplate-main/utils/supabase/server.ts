import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase 클라이언트 (Server Component, Server Action, Route Handler용)
 * 
 * 공식 문서 모범 사례에 따른 구현:
 * https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * 
 * Cookie 기반 세션 관리로 서버와 클라이언트 간 세션을 공유합니다.
 * 
 * @example
 * ```tsx
 * // Server Component
 * import { createClient } from '@/utils/supabase/server';
 * 
 * export default async function MyPage() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @example
 * ```ts
 * // Server Action
 * 'use server';
 * 
 * import { createClient } from '@/utils/supabase/server';
 * 
 * export async function myAction() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return data;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

