# 문제 해결 가이드

## 보일러플레이트 페이지가 표시되지 않는 경우

### 1. 환경 변수 확인

가장 흔한 원인은 환경 변수가 설정되지 않은 것입니다.

#### 필요한 환경 변수

`.env.local` 파일을 `nextjs-supabase-boilerplate-main` 디렉토리에 생성하고 다음 변수를 추가하세요:

```bash
# Clerk (필수)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (선택사항 - Supabase를 사용하지 않으면 제거 가능)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 환경 변수 가져오기

**Clerk 키:**
1. [Clerk Dashboard](https://dashboard.clerk.com/) → **API Keys**
2. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`와 `CLERK_SECRET_KEY` 복사

**Supabase 키 (선택사항):**
1. [Supabase Dashboard](https://supabase.com/dashboard) → **Settings** → **API**
2. `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 복사

### 2. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
# 터미널에서 Ctrl+C로 서버 중지 후
pnpm dev
```

### 3. 브라우저 콘솔 확인

브라우저 개발자 도구(F12)를 열고 Console 탭에서 에러 메시지를 확인하세요.

일반적인 에러:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined` → 환경 변수가 설정되지 않음
- `Failed to fetch` → 네트워크 오류 또는 API 키 문제

### 4. 터미널 에러 확인

터미널에서 빨간색 에러 메시지를 확인하세요.

### 5. Supabase를 사용하지 않는 경우

Supabase를 사용하지 않는다면 `middleware.ts`에서 Supabase 관련 코드를 제거할 수 있습니다:

```typescript
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 6. 캐시 삭제

문제가 계속되면 Next.js 캐시를 삭제하세요:

```bash
cd nextjs-supabase-boilerplate-main
rm -rf .next
pnpm dev
```

Windows PowerShell:
```powershell
cd nextjs-supabase-boilerplate-main
Remove-Item -Recurse -Force .next
pnpm dev
```

## 추가 도움말

- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 문서](https://nextjs.org/docs)

