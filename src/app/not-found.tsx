/**
 * @file not-found.tsx
 * @description 404 Not Found 페이지 컴포넌트.
 * 존재하지 않는 경로 접근 시 Next.js App Router 가 자동으로 렌더링한다.
 * 검색 엔진에 노출되지 않도록 `robots: { index: false }` 메타데이터를 설정한다.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { robots: { index: false } };

/**
 * 404 Not Found 페이지 컴포넌트.
 *
 * @description
 * 잘못된 경로 또는 삭제된 페이지 접근 시 표시된다.
 * '홈으로 돌아가기' 링크로 루트(`/`)로 이동할 수 있다.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-full max-w-layout px-10 min-h-screen">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <p className="text-8xl font-bold text-gray-100 leading-none mb-1">404</p>
        <h2 className="text-lg font-semibold text-gray-900">페이지를 찾을 수 없어요</h2>
        <p className="text-sm text-gray-500">주소가 잘못되었거나 삭제된 페이지입니다.</p>
      </div>
      <Link
        href="/"
        className="bg-black text-white rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
