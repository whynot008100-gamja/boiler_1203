import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductEmptyState } from "./ProductEmptyState";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  searchQuery?: string;
  selectedCategory?: string;
  totalCount?: number;
}

export function ProductGrid({
  products,
  loading = false,
  searchQuery,
  selectedCategory,
  totalCount,
}: ProductGridProps) {
  // 로딩 상태: 스켈레톤 표시
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 빈 상태: 상품이 없을 때
  if (products.length === 0) {
    return (
      <ProductEmptyState
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    );
  }

  // 상품 그리드
  return (
    <>
      {totalCount !== undefined && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          총 <span className="font-semibold">{totalCount}</span>개의 상품
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

