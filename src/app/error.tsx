'use client';

/**
 * @file error.tsx
 * @description 전역 에러 바운더리 컴포넌트.
 * Next.js App Router 의 에러 처리 컴포넌트로, 'use client' 가 필수이며 metadata export 는 동작하지 않는다.
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
