import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              홈으로 가기
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              <Search className="w-5 h-5 mr-2" />
              상품 둘러보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

