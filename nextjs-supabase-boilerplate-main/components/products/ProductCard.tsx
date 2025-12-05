import Link from "next/link";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const categoryLabel =
    product.category && product.category in CATEGORY_LABELS
      ? CATEGORY_LABELS[product.category as ProductCategory]
      : "기타";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full"
    >
      <div
        className={`
          relative h-full border rounded-lg overflow-hidden 
          bg-white dark:bg-gray-900
          transition-all duration-300
          hover:shadow-lg hover:scale-[1.02]
          ${isOutOfStock ? "opacity-75" : ""}
        `}
      >
        {/* 상품 이미지 영역 */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300" />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold text-sm">
                품절
              </span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          {/* 카테고리 배지 */}
          <div className="mb-2">
            <span className="inline-block text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
              {categoryLabel}
            </span>
          </div>

          {/* 상품명 */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* 상품 설명 */}
          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
          )}

          {/* 가격 및 품절 표시 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()}원
            </span>
            {isOutOfStock && (
              <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                품절
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

