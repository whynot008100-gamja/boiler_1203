-- Clerk + Supabase 네이티브 통합 설정
-- 2025년 4월부터 권장되는 방식 (JWT 템플릿 불필요)
--
-- 이 마이그레이션은 Clerk를 Supabase의 third-party auth provider로 설정하기 위한
-- 데이터베이스 레벨 설정을 포함합니다.
--
-- 참고: Supabase Dashboard에서도 Clerk를 third-party provider로 추가해야 합니다:
-- 1. Clerk Dashboard → Setup → Supabase integration 활성화
-- 2. Clerk domain 복사
-- 3. Supabase Dashboard → Authentication → Third-Party Auth → Add Provider → Clerk
-- 4. Clerk domain 입력

-- 예제: Tasks 테이블 생성 (Clerk user_id 기반 RLS 정책 포함)
-- 이 테이블은 Clerk 세션 토큰의 'sub' 클레임을 사용하여 사용자별 데이터를 보호합니다.

CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    -- Clerk user ID를 저장 (auth.jwt()->>'sub'에서 가져옴)
    user_id TEXT NOT NULL DEFAULT (SELECT auth.jwt()->>'sub'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- Row Level Security (RLS) 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;

-- RLS 정책: 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id
);

-- RLS 정책: 사용자는 자신의 tasks만 삽입 가능
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt()->>'sub') = user_id
);

-- RLS 정책: 사용자는 자신의 tasks만 업데이트 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id
)
WITH CHECK (
  (SELECT auth.jwt()->>'sub') = user_id
);

-- RLS 정책: 사용자는 자신의 tasks만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id
);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

