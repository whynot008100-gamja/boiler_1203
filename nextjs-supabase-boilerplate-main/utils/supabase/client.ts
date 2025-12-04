import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase 클라이언트 (Client Component용)
 * 
 * 공식 문서 모범 사례에 따른 구현:
 * https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { createClient } from '@/utils/supabase/client';
 * 
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 * 
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

