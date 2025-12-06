-- ==========================================
-- 카테고리 데이터 확인 및 수정
-- ==========================================

-- 1. 현재 카테고리별 상품 수 확인
SELECT 
  category,
  COUNT(*) as product_count
FROM products
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- 2. 카테고리가 NULL인 상품 확인
SELECT 
  id,
  name,
  category,
  created_at
FROM products
WHERE category IS NULL OR category = '';

-- 3. 카테고리 값 정리 (대소문자 통일 및 공백 제거)
-- 필요시 실행: 카테고리 값이 일관되지 않은 경우
UPDATE products
SET category = LOWER(TRIM(category))
WHERE category IS NOT NULL AND category != '';

-- 4. 카테고리별 상품 확인 (상세)
SELECT 
  category,
  name,
  price
FROM products
WHERE is_active = true
ORDER BY category, name;

