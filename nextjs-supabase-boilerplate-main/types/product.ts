export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "sports"
  | "beauty"
  | "home"
  | "all";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  all: "전체",
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

