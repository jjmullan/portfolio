'use client';

/**
 * @file error.tsx
 * @description 전역 에러 바운더리 컴포넌트.
 * Next.js App Router 의 에러 처리 컴포넌트로, 'use client' 가 필수이며 metadata export 는 동작하지 않는다.
 */

/**
 * 전역 에러 바운더리 컴포넌트.
 *
 * @description
 * Next.js App Router 의 에러 처리 컴포넌트. `'use client'` 가 필수이며 `metadata` export 는 동작하지 않는다.
 * 에러 발생 시 사용자 친화적인 안내 메시지와 재시도 버튼을 표시한다.
 *
 * @param props.error - 발생한 에러 객체 (Next.js 내부 `digest` 포함 가능)
 * @param props.reset - 에러 상태를 초기화하고 렌더링을 재시도하는 함수
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-full max-w-layout px-10 min-h-screen">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <p className="text-4xl mb-2">⚠️</p>
        <h2 className="text-lg font-semibold text-gray-900">문제가 발생했어요</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          서비스를 이용하는 중 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="bg-black text-white rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors"
      >
        다시 시도하기
      </button>
    </div>
  );
}
