"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (추후 에러 로깅 서비스 연동 가능)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
        <p className="text-gray-600 mb-6">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            다시 시도
          </Button>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              홈으로 가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

