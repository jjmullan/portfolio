/**
 * @file page.tsx
 * @description `/chat` 라우트 페이지.
 * AI 채팅 페이지(`Chat`)를 렌더링한다.
 * `Chat` 내부에서 `useSearchParams()` 를 사용하므로 `Suspense` 경계가 필수이다.
 */

import Chat from '@pages/Chat';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '대화 목록',
  alternates: { canonical: 'https://youngjune.dev/chat' },
};

/**
 * `/chat` 라우트 진입점.
 *
 * @description
 * `useSearchParams()` 훅 사용으로 인해 `Suspense` 경계 내에서 `Chat` 컴포넌트를 렌더링한다.
 * `Suspense` 없이 사용하면 빌드 오류가 발생한다.
 */
// useSearchParams() 사용으로 Suspense 경계 필요
export default function Page() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
}
