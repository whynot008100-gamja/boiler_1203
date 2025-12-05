export function ProductSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 animate-pulse">
      {/* 이미지 영역 스켈레톤 */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800" />

      {/* 정보 영역 스켈레톤 */}
      <div className="p-4 space-y-3">
        {/* 카테고리 배지 스켈레톤 */}
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />

        {/* 상품명 스켈레톤 */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>

        {/* 설명 스켈레톤 */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>

        {/* 가격 스켈레톤 */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

