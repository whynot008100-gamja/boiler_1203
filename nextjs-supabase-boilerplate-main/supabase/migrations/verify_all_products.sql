-- ==========================================
-- 전체 상품 목록 확인 및 카테고리 검증
-- ==========================================

-- 카테고리별 상품 목록 (상세)
SELECT 
  category,
  name,
  price,
  stock_quantity,
  CASE 
    WHEN category = 'electronics' AND name NOT LIKE '%이어폰%' AND name NOT LIKE '%스피커%' AND name NOT LIKE '%헤드폰%' AND name NOT LIKE '%워치%' AND name NOT LIKE '%배터리%' AND name NOT LIKE '%마우스%' AND name NOT LIKE '%허브%' AND name NOT LIKE '%키보드%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'clothing' AND name NOT LIKE '%티셔츠%' AND name NOT LIKE '%자켓%' AND name NOT LIKE '%청바지%' AND name NOT LIKE '%레깅스%' AND name NOT LIKE '%스웨터%' AND name NOT LIKE '%셔츠%' AND name NOT LIKE '%조끼%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'books' AND name NOT LIKE '%코드%' AND name NOT LIKE '%타입스크립트%' AND name NOT LIKE '%HTTP%' AND name NOT LIKE '%Next.js%' AND name NOT LIKE '%디자인 패턴%' AND name NOT LIKE '%가이드%' AND name NOT LIKE '%입문%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'food' AND name NOT LIKE '%커피%' AND name NOT LIKE '%아몬드%' AND name NOT LIKE '%오일%' AND name NOT LIKE '%그래놀라%' AND name NOT LIKE '%말차%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'sports' AND name NOT LIKE '%요가%' AND name NOT LIKE '%덤벨%' AND name NOT LIKE '%폼롤러%' AND name NOT LIKE '%로프%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'beauty' AND name NOT LIKE '%세럼%' AND name NOT LIKE '%선크림%' AND name NOT LIKE '%크림%' AND name NOT LIKE '%클렌징%' THEN '⚠️ 카테고리 확인 필요'
    WHEN category = 'home' AND name NOT LIKE '%디퓨저%' AND name NOT LIKE '%청소기%' THEN '⚠️ 카테고리 확인 필요'
    ELSE '✅ 정상'
  END as validation_status
FROM products
WHERE is_active = true
ORDER BY category, name;

-- 카테고리별 상품 수 요약
SELECT 
  category,
  COUNT(*) as product_count,
  STRING_AGG(name, ' | ' ORDER BY name) as product_list
FROM products
WHERE is_active = true
GROUP BY category
ORDER BY category;

