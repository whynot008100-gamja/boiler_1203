"use client";

import { useState, useEffect, useCallback } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/products/Pagination";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const supabase = useClerkSupabaseClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "name_asc">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 상품 가져오기 (페이지네이션 적용)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 기본 쿼리 빌더
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // 카테고리 필터
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // 검색 필터 (이름 또는 설명에서 검색)
      if (searchQuery.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // 정렬
      switch (sortBy) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      // 페이지네이션
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      // Supabase 에러인 경우 message 속성에서 에러 메시지 추출
      const supabaseError = err as { message?: string; code?: string };
      const errorMessage =
        supabaseError.message ||
        (err instanceof Error
          ? err.message
          : "상품을 가져오는 중 오류가 발생했습니다.");
      setError(errorMessage);
      console.error("Error fetching products:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedCategory, searchQuery, sortBy, currentPage]);

  // 필터/검색/정렬 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // 데이터 가져오기
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤 상단으로 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories: ProductCategory[] = [
    "all",
    "electronics",
    "clothing",
    "books",
    "food",
    "sports",
    "beauty",
    "home",
  ];

  // 에러 상태
  if (error && !loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={fetchProducts}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          상품 목록
        </h1>

        {/* 검색 및 정렬 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="상품명 또는 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">최신순</option>
              <option value="name_asc">이름순</option>
            </select>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {CATEGORY_LABELS[category]}
            </Button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <ProductGrid
        products={products}
        loading={loading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        totalCount={totalCount}
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
