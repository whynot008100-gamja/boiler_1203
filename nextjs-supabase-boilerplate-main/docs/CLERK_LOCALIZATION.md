# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [설정 확인](#설정-확인)
3. [커스텀 로컬라이제이션](#커스텀-로컬라이제이션)
4. [에러 메시지 커스터마이징](#에러-메시지-커스터마이징)
5. [참고 자료](#참고-자료)

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 여러 언어를 지원합니다. 한국어는 `ko-KR` (BCP 47)이며, 패키지에서는 `koKR`로 import합니다.

> ⚠️ **주의**: 이 기능은 현재 실험적(experimental) 단계입니다. 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.

> 📝 **참고**: 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다. [Clerk Account Portal](https://clerk.com/docs/guides/customizing-clerk/account-portal)은 영어로 유지됩니다.

## 설정 확인

프로젝트에 이미 한국어 로컬라이제이션이 적용되어 있습니다.

### 1. 패키지 설치 확인

`package.json`에 `@clerk/localizations` 패키지가 설치되어 있는지 확인:

```json
{
  "dependencies": {
    "@clerk/localizations": "^3.26.3"
  }
}
```

### 2. 로컬라이제이션 적용 확인

`app/layout.tsx`에서 한국어 로컬라이제이션이 적용되어 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        cssLayerName: "clerk", // Tailwind CSS 4 호환성
      }}
    >
      <html lang="ko">
        {/* ... */}
      </html>
    </ClerkProvider>
  );
}
```

### 3. 적용된 내용

다음 Clerk 컴포넌트들이 한국어로 표시됩니다:

- ✅ Sign In 컴포넌트
- ✅ Sign Up 컴포넌트
- ✅ User Button
- ✅ 모든 인증 관련 메시지 및 라벨

## 커스텀 로컬라이제이션

기본 한국어 번역을 수정하거나 추가 커스터마이징이 필요한 경우:

### 예제: 로그인 제목 변경

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

const customKoKR = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    start: {
      ...koKR.signIn.start,
      title: "환영합니다",
      subtitle: "{{applicationName}}에 로그인하세요",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      {/* ... */}
    </ClerkProvider>
  );
}
```

### 예제: 회원가입 메시지 변경

```tsx
const customKoKR = {
  ...koKR,
  signUp: {
    ...koKR.signUp,
    start: {
      ...koKR.signUp.start,
      title: "계정 만들기",
      subtitle: "{{applicationName}}에 가입하세요",
    },
  },
};
```

## 에러 메시지 커스터마이징

Clerk의 기본 에러 메시지를 한국어로 커스터마이징할 수 있습니다.

### 예제: 접근 불가 에러 메시지 변경

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access:
      "접근 권한이 없습니다. 회사 이메일 도메인을 허용 목록에 추가하려면 이메일을 보내주세요.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      {/* ... */}
    </ClerkProvider>
  );
}
```

### 사용 가능한 에러 키

전체 에러 키 목록은 [영어 로컬라이제이션 파일](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)의 `unstable__errors` 객체를 참조하세요.

일반적인 에러 키:

- `not_allowed_access`: 접근 불가
- `form_identifier_not_found`: 사용자를 찾을 수 없음
- `form_password_pwned`: 보안이 약한 비밀번호
- `form_password_length_too_short`: 비밀번호가 너무 짧음
- `form_username_invalid`: 잘못된 사용자명

## 지원되는 언어

Clerk는 다음 언어를 지원합니다:

| 언어 | BCP 47 | 키 |
|------|--------|-----|
| 한국어 | ko-KR | `koKR` |
| 영어 (미국) | en-US | `enUS` |
| 영어 (영국) | en-GB | `enGB` |
| 일본어 | ja-JP | `jaJP` |
| 중국어 (간체) | zh-CN | `zhCN` |
| 중국어 (번체) | zh-TW | `zhTW` |
| 스페인어 | es-ES | `esES` |
| 프랑스어 | fr-FR | `frFR` |
| 독일어 | de-DE | `deDE` |
| ... | ... | ... |

전체 언어 목록은 [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)를 참조하세요.

## 참고 자료

- [Clerk Localization 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)
- [영어 로컬라이제이션 파일 (GitHub)](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)
- [한국어 로컬라이제이션 파일 (GitHub)](https://github.com/clerk/javascript/blob/main/packages/localizations/src/ko-KR.ts)

## 문제 해결

### 로컬라이제이션이 적용되지 않음

1. `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. `ClerkProvider`에 `localization` prop이 올바르게 전달되었는지 확인
3. 개발 서버를 재시작 (`npm run dev`)

### 일부 텍스트가 여전히 영어로 표시됨

- 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다
- Clerk Account Portal은 영어로 유지됩니다
- 커스텀 컴포넌트의 텍스트는 직접 번역해야 합니다

### 타입 오류

TypeScript를 사용하는 경우, `@clerk/localizations` 패키지의 타입 정의가 자동으로 포함됩니다. 타입 오류가 발생하면:

1. `node_modules` 삭제 후 재설치
2. TypeScript 서버 재시작

