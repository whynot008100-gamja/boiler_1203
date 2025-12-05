import { ShoppingBag, Search } from "lucide-react";

interface ProductEmptyStateProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export function ProductEmptyState({
  searchQuery,
  selectedCategory,
}: ProductEmptyStateProps) {
  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  const hasCategoryFilter = selectedCategory && selectedCategory !== "all";

  let title = "상품이 없습니다";
  let description = "현재 등록된 상품이 없습니다.";

  if (hasSearchQuery && hasCategoryFilter) {
    title = "검색 결과가 없습니다";
    description = `"${searchQuery}" 검색어와 선택한 카테고리에 해당하는 상품을 찾을 수 없습니다.`;
  } else if (hasSearchQuery) {
    title = "검색 결과가 없습니다";
    description = `"${searchQuery}" 검색어에 해당하는 상품을 찾을 수 없습니다.`;
  } else if (hasCategoryFilter) {
    title = "상품이 없습니다";
    description = "선택한 카테고리에 해당하는 상품이 없습니다.";
  }

  return (
    <div className="text-center py-16 px-4">
      <div className="flex justify-center mb-4">
        {hasSearchQuery ? (
          <Search className="w-16 h-16 text-gray-400 dark:text-gray-600" />
        ) : (
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}

