import Link from "next/link";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/types/product";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

// 카테고리별 색상
const categoryColors: Record<string, string> = {
  electronics: "from-blue-500 to-cyan-500",
  clothing: "from-pink-500 to-rose-500",
  books: "from-amber-500 to-orange-500",
  food: "from-green-500 to-emerald-500",
  sports: "from-red-500 to-pink-500",
  beauty: "from-purple-500 to-fuchsia-500",
  home: "from-teal-500 to-cyan-500",
};

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const categoryLabel =
    product.category && product.category in CATEGORY_LABELS
      ? CATEGORY_LABELS[product.category as ProductCategory]
      : "기타";
  const gradientColor =
    categoryColors[product.category || ""] || "from-gray-400 to-gray-500";

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div
        className={`
          product-card relative h-full rounded-2xl overflow-hidden 
          bg-card border border-border/50
          hover:border-primary/30 hover:shadow-xl
          ${isOutOfStock ? "opacity-75" : ""}
        `}
      >
        {/* 상품 이미지 영역 */}
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <div className="product-image absolute inset-0 flex items-center justify-center">
            {/* 배경 그라데이션 효과 */}
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientColor} opacity-20 blur-xl`}
            />
            <ShoppingBag className="absolute w-16 h-16 text-muted-foreground/40 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* 카테고리 배지 */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${gradientColor} text-white shadow-lg`}
            >
              <Tag className="w-3 h-3" />
              {categoryLabel}
            </span>
          </div>

          {/* 품절/재고 부족 배지 */}
          {isOutOfStock && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive text-white shadow-lg">
                품절
              </span>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500 text-white shadow-lg">
                {product.stock_quantity}개 남음
              </span>
            </div>
          )}

          {/* 품절 오버레이 */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-6 py-3 rounded-full bg-foreground/90 text-background font-semibold text-sm">
                품절된 상품입니다
              </span>
            </div>
          )}

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* 상품 정보 */}
        <div className="p-5">
          {/* 상품명 */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* 상품 설명 */}
          {product.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
          )}

          {/* 가격 및 장바구니 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
              {product.price.toLocaleString()}
              <span className="text-sm ml-1 text-foreground">원</span>
            </span>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
