-- ==========================================
-- 상품 카테고리 수정 및 검증
-- ==========================================
-- 
-- 사용자가 언급한 "클린코트" 문제 해결
-- 모든 상품의 카테고리를 확인하고 수정
-- ==========================================

-- 1. "클린"이 포함된 모든 상품 확인
SELECT 
  id,
  name,
  category,
  description,
  price,
  CASE 
    WHEN name LIKE '%클린%' AND category != 'books' THEN '⚠️ 카테고리 확인 필요'
    WHEN name LIKE '%코드%' AND category != 'books' THEN '⚠️ 카테고리 확인 필요'
    WHEN name LIKE '%코트%' AND category != 'clothing' THEN '⚠️ 카테고리 확인 필요'
    ELSE '✅ 정상'
  END as validation
FROM products
WHERE name LIKE '%클린%' OR name LIKE '%코드%' OR name LIKE '%코트%'
ORDER BY name;

-- 2. 의류 카테고리에 있어야 할 상품 확인
-- "코트", "재킷", "자켓", "아우터" 등이 포함된 상품
SELECT 
  id,
  name,
  category,
  CASE 
    WHEN category != 'clothing' THEN '⚠️ 의류로 변경 필요'
    ELSE '✅ 정상'
  END as validation
FROM products
WHERE (
  name LIKE '%코트%' OR 
  name LIKE '%재킷%' OR 
  name LIKE '%자켓%' OR
  name LIKE '%아우터%' OR
  name LIKE '%외투%'
)
ORDER BY name;

-- 3. 도서 카테고리에 있어야 할 상품 확인
-- "코드", "가이드", "입문", "패턴" 등이 포함된 상품
SELECT 
  id,
  name,
  category,
  CASE 
    WHEN category != 'books' THEN '⚠️ 도서로 변경 필요'
    ELSE '✅ 정상'
  END as validation
FROM products
WHERE (
  name LIKE '%코드%' OR 
  name LIKE '%가이드%' OR 
  name LIKE '%입문%' OR
  name LIKE '%패턴%' OR
  name LIKE '%타입스크립트%' OR
  name LIKE '%HTTP%' OR
  name LIKE '%Next.js%'
)
ORDER BY name;

-- 4. 카테고리 수정 (필요시)
-- "클린코트"가 도서에 있다면 의류로 변경
-- UPDATE products
-- SET category = 'clothing'
-- WHERE name LIKE '%클린코트%' AND category = 'books';

-- 5. 전체 카테고리별 상품 수 최종 확인
SELECT 
  category,
  COUNT(*) as product_count,
  STRING_AGG(name, ', ' ORDER BY name) as product_list
FROM products
WHERE is_active = true
GROUP BY category
ORDER BY category;

