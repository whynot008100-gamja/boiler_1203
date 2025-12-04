# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 네이티브 통합하는 방법을 설명합니다. 2025년 4월부터 권장되는 방식으로, JWT 템플릿이 필요하지 않습니다.

## 📋 목차

1. [개요](#개요)
2. [사전 요구사항](#사전-요구사항)
3. [Clerk Dashboard 설정](#clerk-dashboard-설정)
4. [Supabase Dashboard 설정](#supabase-dashboard-설정)
5. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
6. [환경 변수 설정](#환경-변수-설정)
7. [데이터베이스 마이그레이션](#데이터베이스-마이그레이션)
8. [코드 사용법](#코드-사용법)
9. [RLS 정책 이해하기](#rls-정책-이해하기)
10. [문제 해결](#문제-해결)

## 개요

Clerk와 Supabase의 네이티브 통합을 통해:

- ✅ JWT 템플릿 불필요 (2025년 4월 이후 권장 방식)
- ✅ Clerk 세션 토큰을 직접 Supabase에 전달
- ✅ RLS(Row Level Security) 정책으로 사용자별 데이터 보호
- ✅ 추가 토큰 생성 없이 낮은 지연 시간

## 사전 요구사항

- [x] Clerk 계정 및 애플리케이션 생성 완료
- [x] Supabase 프로젝트 생성 완료
- [x] Next.js 프로젝트에 `@clerk/nextjs` 및 `@supabase/supabase-js` 설치 완료

## Clerk Dashboard 설정

### 1. Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. **Setup** → **Supabase** 메뉴로 이동
3. **"Activate Supabase integration"** 클릭
4. **Clerk domain** 복사 (예: `your-app-12.clerk.accounts.dev`)
   - 이 값은 다음 단계에서 사용합니다

### 2. 세션 토큰에 `role` 클레임 추가 (자동 처리됨)

Clerk의 Supabase 통합을 활성화하면 세션 토큰에 자동으로 `role: 'authenticated'` 클레임이 추가됩니다. 별도 설정이 필요하지 않습니다.

## Supabase Dashboard 설정

### 1. Third-Party Auth Provider 추가

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Authentication** → **Providers** 메뉴로 이동
4. 페이지 하단의 **"Third-Party Auth"** 섹션 찾기
5. **"Add Provider"** 클릭
6. **"Clerk"** 선택
7. Clerk Dashboard에서 복사한 **Clerk domain** 입력
8. **"Save"** 클릭

### 2. 확인

설정이 완료되면 Supabase가 Clerk의 공개 키를 자동으로 가져와서 JWT를 검증할 수 있게 됩니다.

## 로컬 개발 환경 설정

로컬 개발을 위해 `supabase/config.toml` 파일을 업데이트하세요:

```toml
[auth.third_party.clerk]
enabled = true
domain = "your-app-12.clerk.accounts.dev"  # Clerk Dashboard에서 복사한 domain
```

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # 서버 사이드 전용
```

> ⚠️ **주의**: `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출되면 안 됩니다. 서버 사이드에서만 사용하세요.

## 데이터베이스 마이그레이션

프로젝트에는 두 개의 마이그레이션 파일이 포함되어 있습니다:

### 1. `setup_schema.sql`

`users` 테이블을 생성하고 RLS 정책을 설정합니다:

```sql
-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS 활성화 및 정책 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회/수정/삭제 가능
CREATE POLICY "Users can view their own data"
ON public.users FOR SELECT TO authenticated
USING ((SELECT auth.jwt()->>'sub') = clerk_id);
```

### 2. `setup_clerk_integration.sql`

예제 `tasks` 테이블을 생성하고 Clerk user_id 기반 RLS 정책을 설정합니다:

```sql
-- Tasks 테이블 생성
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (SELECT auth.jwt()->>'sub'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS 정책 설정
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);
```

### 마이그레이션 실행

로컬 개발 환경:

```bash
supabase db reset  # 모든 마이그레이션 실행
```

프로덕션 환경:

Supabase Dashboard → **SQL Editor**에서 마이그레이션 파일의 내용을 실행하거나, Supabase CLI를 사용하여 배포합니다.

## 코드 사용법

### Client Component에서 사용

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Tasks:', data);
  }

  return <button onClick={fetchTasks}>Load Tasks</button>;
}
```

### Server Component에서 사용

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) {
    throw error;
  }

  return (
    <div>
      {data?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```ts
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';

export async function createTask(name: string) {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error('Failed to create task');
  }

  return data;
}
```

## RLS 정책 이해하기

RLS(Row Level Security) 정책은 사용자가 자신의 데이터만 접근할 수 있도록 보장합니다.

### 기본 구조

```sql
CREATE POLICY "policy_name"
ON table_name
FOR operation  -- SELECT, INSERT, UPDATE, DELETE
TO authenticated
USING (condition);  -- SELECT, UPDATE, DELETE에 사용
WITH CHECK (condition);  -- INSERT, UPDATE에 사용
```

### Clerk user_id 확인

Clerk 세션 토큰의 `sub` 클레임에서 사용자 ID를 가져옵니다:

```sql
(SELECT auth.jwt()->>'sub') = user_id
```

### 예제: Tasks 테이블 RLS 정책

```sql
-- 조회: 자신의 tasks만 볼 수 있음
CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);

-- 삽입: 자신의 user_id로만 삽입 가능
CREATE POLICY "Users can insert their own tasks"
ON public.tasks FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

-- 업데이트: 자신의 tasks만 수정 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks FOR UPDATE TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id)
WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

-- 삭제: 자신의 tasks만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks FOR DELETE TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);
```

## 문제 해결

### 1. "JWT expired" 오류

- **원인**: Clerk 세션 토큰이 만료됨
- **해결**: Clerk SDK가 자동으로 토큰을 갱신합니다. `accessToken` 함수가 매 요청마다 최신 토큰을 반환하도록 구현되어 있습니다.

### 2. "new row violates row-level security policy" 오류

- **원인**: RLS 정책이 올바르게 설정되지 않았거나, `user_id`가 Clerk user ID와 일치하지 않음
- **해결**:
  1. RLS 정책이 활성화되어 있는지 확인
  2. `user_id` 컬럼이 `auth.jwt()->>'sub'`와 일치하는지 확인
  3. Supabase Dashboard에서 테이블의 RLS 정책 확인

### 3. "role 'authenticated' does not exist" 오류

- **원인**: Clerk 세션 토큰에 `role: 'authenticated'` 클레임이 없음
- **해결**:
  1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
  2. Clerk domain이 올바르게 설정되었는지 확인

### 4. 로컬 개발 환경에서 작동하지 않음

- **원인**: `supabase/config.toml`에 Clerk 설정이 없음
- **해결**: `[auth.third_party.clerk]` 섹션을 추가하고 `enabled = true`로 설정

## 참고 자료

- [Clerk Supabase 통합 공식 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 추가 기능

### 사용자 동기화

프로젝트에는 Clerk 사용자를 Supabase `users` 테이블에 자동으로 동기화하는 기능이 포함되어 있습니다:

- `hooks/use-sync-user.ts`: 클라이언트에서 사용자 동기화
- `app/api/sync-user/route.ts`: 서버 API 엔드포인트
- `components/providers/sync-user-provider.tsx`: 자동 동기화 Provider

### 예제 페이지

- `/auth-test`: Clerk + Supabase 통합 테스트 페이지
- `/storage-test`: Supabase Storage 테스트 페이지

## 지원

문제가 발생하면 다음을 확인하세요:

1. 환경 변수가 올바르게 설정되었는지
2. Clerk와 Supabase Dashboard 설정이 완료되었는지
3. 데이터베이스 마이그레이션이 실행되었는지
4. RLS 정책이 올바르게 설정되었는지

