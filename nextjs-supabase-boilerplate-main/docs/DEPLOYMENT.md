# 배포 가이드

## Vercel 배포

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

#### 필수 환경 변수

**Clerk:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Toss Payments (선택사항):**
```
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
```

### 2. 환경 변수 설정 방법

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 환경 변수 값
   - **Environment**: Production, Preview, Development (필요에 따라 선택)

### 3. 배포 확인

1. **Deployments** 탭에서 배포 상태 확인
2. 배포 완료 후 도메인으로 접속하여 기능 테스트
3. 주요 기능 확인:
   - [ ] 홈페이지 로딩
   - [ ] 로그인/회원가입
   - [ ] 상품 목록 표시
   - [ ] 장바구니 기능
   - [ ] 주문 생성
   - [ ] 결제 페이지 (Toss Payments 위젯 표시)

### 4. 프로덕션 빌드 테스트

로컬에서 프로덕션 빌드 테스트:

```bash
npm run build
npm start
```

빌드 오류가 없는지 확인하세요.

### 5. 도메인 설정 (선택사항)

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 커스텀 도메인 추가
3. DNS 설정 안내에 따라 도메인 연결

## Supabase 마이그레이션 실행

### 1. Supabase Dashboard에서 마이그레이션 실행

1. Supabase Dashboard → **SQL Editor**
2. `supabase/migrations/db.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. **Run** 클릭하여 실행

### 2. 테이블 확인

**Table Editor**에서 다음 테이블이 생성되었는지 확인:
- `products`
- `cart_items`
- `orders`
- `order_items`

### 3. 샘플 데이터 확인

`products` 테이블에 샘플 데이터가 삽입되었는지 확인하세요.

## 문제 해결

### 빌드 실패

- 환경 변수가 모두 설정되었는지 확인
- TypeScript 오류 확인: `npm run build` 실행
- ESLint 오류 확인: `npm run lint` 실행

### 런타임 오류

- 브라우저 콘솔 확인 (F12)
- Vercel 로그 확인: **Deployments** → **Logs**
- 환경 변수 값 확인

### 결제 위젯이 표시되지 않음

- `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` 환경 변수 확인
- Toss Payments 대시보드에서 키 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 성능 최적화

### 이미지 최적화

현재는 플레이스홀더 이미지를 사용 중입니다. 실제 이미지를 사용할 때:

1. Next.js Image 컴포넌트 사용
2. 이미지 CDN 사용 (예: Cloudinary, Supabase Storage)
3. 이미지 최적화 (WebP 형식, 적절한 크기)

### 코드 스플리팅

Next.js가 자동으로 코드 스플리팅을 수행합니다. 필요시:

```typescript
import dynamic from 'next/dynamic';

const PaymentPage = dynamic(() => import('./payment'), {
  loading: () => <Loading />,
});
```

## 모니터링

### Vercel Analytics

1. Vercel 대시보드 → **Analytics**
2. 웹사이트 성능 모니터링
3. 사용자 행동 분석

### 에러 로깅

프로덕션 환경에서는 에러 로깅 서비스 연동 권장:
- Sentry
- LogRocket
- Vercel Logs

