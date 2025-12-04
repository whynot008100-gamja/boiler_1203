# Supabase 연결 설정 가이드

이 문서는 Supabase 공식 문서의 모범 사례를 기반으로 Next.js 프로젝트에 Supabase를 연결하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [패키지 설치](#패키지-설치)
3. [환경 변수 설정](#환경-변수-설정)
4. [Supabase 클라이언트 설정](#supabase-클라이언트-설정)
5. [Middleware 설정](#middleware-설정)
6. [사용 방법](#사용-방법)
7. [Clerk 통합과의 관계](#clerk-통합과의-관계)

## 개요

이 프로젝트는 Supabase 공식 문서의 모범 사례를 따릅니다:

- ✅ `@supabase/ssr` 패키지 사용 (Server-Side Rendering 지원)
- ✅ Cookie 기반 세션 관리
- ✅ PKCE 인증 플로우 (기본값)
- ✅ Middleware를 통한 자동 세션 갱신

## 패키지 설치

필요한 패키지는 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.8",
    "@supabase/ssr": "^0.5.2"
  }
}
```

새로 설치해야 하는 경우:

```bash
npm install @supabase/supabase-js @supabase/ssr
# 또는
pnpm add @supabase/supabase-js @supabase/ssr
```

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 환경 변수 가져오기

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. **Project URL**과 **anon public** 키를 복사하여 `.env.local`에 추가

> ⚠️ **주의**: `NEXT_PUBLIC_` 접두사가 필요합니다. 이 접두사가 없으면 클라이언트에서 환경 변수에 접근할 수 없습니다.

## Supabase 클라이언트 설정

프로젝트에는 두 가지 클라이언트가 설정되어 있습니다:

### 1. Client Component용 (`utils/supabase/client.ts`)

브라우저에서 실행되는 Client Component에서 사용합니다.

```tsx
'use client';

import { createClient } from '@/utils/supabase/client';

export default function MyComponent() {
  const supabase = createClient();
  
  async function fetchData() {
    const { data, error } = await supabase
      .from('table')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    return data;
  }

  return <div>...</div>;
}
```

### 2. Server Component용 (`utils/supabase/server.ts`)

서버에서 실행되는 Server Component, Server Action, Route Handler에서 사용합니다.

```tsx
// Server Component
import { createClient } from '@/utils/supabase/server';

export default async function MyPage() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('table')
    .select('*');

  if (error) {
    throw error;
  }

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

```ts
// Server Action
'use server';

import { createClient } from '@/utils/supabase/server';

export async function createItem(name: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('table')
    .insert({ name });

  if (error) {
    throw new Error('Failed to create item');
  }

  return data;
}
```

## Middleware 설정

`middleware.ts` 파일이 자동으로 Supabase 세션을 갱신합니다:

- 만료된 Auth 토큰을 자동으로 갱신
- Server Components에 최신 세션 정보 제공
- 브라우저에 갱신된 토큰 전달

이 설정은 자동으로 작동하므로 추가 작업이 필요하지 않습니다.

## 사용 방법

### 예제: 데이터 조회

```tsx
// app/instruments/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();
  
  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
```

### 예제: 데이터 삽입

```tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function AddItem() {
  const [name, setName] = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('table')
      .insert({ name });

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    alert('Item added!');
    setName('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

## Clerk 통합과의 관계

이 프로젝트는 Clerk를 인증 제공자로 사용하고 있습니다. Supabase 클라이언트는 두 가지 방식으로 사용할 수 있습니다:

### 1. Supabase Auth 사용 (공식 문서 방식)

`utils/supabase/client.ts`와 `utils/supabase/server.ts`를 사용하면 Supabase의 기본 인증 시스템을 사용할 수 있습니다.

```tsx
// Supabase Auth 사용
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
await supabase.auth.signInWithPassword({ email, password });
```

### 2. Clerk + Supabase 통합 (Third-Party Auth)

Clerk를 third-party auth provider로 사용하려면 `lib/supabase/clerk-client.ts`와 `lib/supabase/server.ts`를 사용하세요.

```tsx
// Clerk + Supabase 통합
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

const supabase = useClerkSupabaseClient();
// Clerk 세션 토큰이 자동으로 Supabase에 전달됩니다
```

자세한 내용은 [Clerk + Supabase 통합 가이드](./CLERK_SUPABASE_INTEGRATION.md)를 참조하세요.

## 참고 자료

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Server-Side Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase SSR Package](https://github.com/supabase/auth-helpers/tree/main/packages/ssr)

## 문제 해결

### "NEXT_PUBLIC_SUPABASE_URL is not defined" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름에 `NEXT_PUBLIC_` 접두사가 있는지 확인
- 개발 서버를 재시작 (`npm run dev`)

### 세션이 서버에서 인식되지 않음

- `middleware.ts`가 올바르게 설정되었는지 확인
- `utils/supabase/middleware.ts` 파일이 존재하는지 확인
- 브라우저 개발자 도구에서 쿠키가 설정되었는지 확인

### 타입 오류

TypeScript 타입을 생성하려면:

```bash
npm run gen:types
```

또는 Supabase CLI를 사용:

```bash
npx supabase gen types typescript --project-id <project-id> --schema public > database.types.ts
```

