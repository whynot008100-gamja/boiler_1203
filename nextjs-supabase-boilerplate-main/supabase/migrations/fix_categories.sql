-- ==========================================
-- 카테고리 데이터 정리 및 수정
-- ==========================================
-- 
-- 이 스크립트는 카테고리 데이터를 정리합니다:
-- 1. NULL 또는 빈 문자열인 카테고리 확인
-- 2. 대소문자 통일 (소문자로)
-- 3. 공백 제거
-- ==========================================

-- 1. 현재 상태 확인
SELECT 
  'Before fix' as status,
  category,
  COUNT(*) as count
FROM products
GROUP BY category
ORDER BY category;

-- 2. 카테고리 정리 (대소문자 통일 및 공백 제거)
UPDATE products
SET category = LOWER(TRIM(category))
WHERE category IS NOT NULL 
  AND category != ''
  AND (category != LOWER(TRIM(category)) OR category != TRIM(category));

-- 3. 정리 후 상태 확인
SELECT 
  'After fix' as status,
  category,
  COUNT(*) as count
FROM products
GROUP BY category
ORDER BY category;

-- 4. 카테고리별 상품 목록 확인
SELECT 
  category,
  COUNT(*) as product_count,
  STRING_AGG(name, ', ' ORDER BY name) as product_names
FROM products
WHERE is_active = true
GROUP BY category
ORDER BY category;

