"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuPlus, LuTrash2, LuCheck, LuX } from "react-icons/lu";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function TasksTestPage() {
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Tasks 가져오기
  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Supabase 환경 변수 확인
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error(
          "Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
        );
      }

      const { data, error: queryError } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        // 테이블이 없는 경우를 구분
        if (queryError.code === "42P01" || queryError.message.includes("does not exist")) {
          throw new Error(
            "tasks 테이블이 생성되지 않았습니다. Supabase Dashboard에서 마이그레이션을 실행하세요."
          );
        }
        throw queryError;
      }
      setTasks(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Tasks를 가져오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task 생성
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !user) return;

    try {
      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          name: newTaskName.trim(),
          description: newTaskDescription.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTasks((prev) => [data, ...prev]);
      setNewTaskName("");
      setNewTaskDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Task 생성 실패: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Task 완료 상태 토글
  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({ completed: !currentStatus })
        .eq("id", taskId);

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Task 업데이트 실패: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Task 삭제
  const deleteTask = async (taskId: number) => {
    if (!confirm("정말 이 task를 삭제하시겠습니까?")) return;

    try {
      const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Task 삭제 실패: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchTasks();
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-gray-600">Tasks를 관리하려면 먼저 로그인해주세요.</p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">Tasks 관리 (RLS 테스트)</h1>
        <p className="text-gray-600">
          Clerk + Supabase RLS 정책을 사용한 Tasks 관리 예제입니다.
          각 사용자는 자신의 tasks만 조회/수정/삭제할 수 있습니다.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ 오류</h3>
          <p className="text-sm text-red-700 mb-2">{error}</p>
          <div className="text-xs text-red-600 space-y-1">
            <p><strong>해결 방법:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Supabase 환경 변수가 설정되었는지 확인 (.env.local 파일)</li>
              <li>Supabase Dashboard에서 마이그레이션 실행 확인</li>
              <li>tasks 테이블이 생성되었는지 확인</li>
              <li>브라우저 콘솔(F12)에서 자세한 에러 확인</li>
            </ul>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2"
          >
            닫기
          </Button>
        </div>
      )}

      {/* 새 Task 생성 폼 */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">새 Task 추가</h2>
        <form onSubmit={createTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task 이름 *</label>
            <Input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task 이름을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">설명 (선택)</label>
            <Input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task 설명을 입력하세요"
            />
          </div>
          <Button type="submit" className="w-full">
            <LuPlus className="w-4 h-4 mr-2" />
            Task 추가
          </Button>
        </form>
      </div>

      {/* Tasks 목록 */}
      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">내 Tasks</h2>
            <Button variant="outline" size="sm" onClick={fetchTasks} disabled={loading}>
              {loading ? "로딩 중..." : "새로고침"}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading && tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">로딩 중...</div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>아직 task가 없습니다.</p>
              <p className="text-sm mt-2">위의 폼을 사용하여 새 task를 추가하세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg flex items-start gap-4 ${
                    task.completed ? "bg-gray-50 opacity-75" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {task.completed && <LuCheck className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      생성: {new Date(task.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LuTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 RLS 정책 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            <strong>SELECT 정책</strong>: 사용자는 자신의 user_id와 일치하는 tasks만 조회할 수
            있습니다
          </li>
          <li>
            <strong>INSERT 정책</strong>: 새 task는 자동으로 현재 사용자의 user_id로 설정됩니다
            (DEFAULT 값)
          </li>
          <li>
            <strong>UPDATE 정책</strong>: 사용자는 자신의 tasks만 수정할 수 있습니다
          </li>
          <li>
            <strong>DELETE 정책</strong>: 사용자는 자신의 tasks만 삭제할 수 있습니다
          </li>
          <li className="mt-2">
            다른 사용자로 로그인하면 다른 tasks 목록이 표시됩니다 (RLS 정책에 의해 필터링됨)
          </li>
        </ul>
      </div>
    </div>
  );
}

