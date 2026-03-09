/**
 * @file page.tsx
 * @description `/new` 라우트 페이지.
 * 새 채팅을 시작하는 홈 페이지(`Home`)를 렌더링한다.
 * canonical URL 을 `https://youngjune.dev/new` 로 설정한다.
 */

import Home from '@pages/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://youngjune.dev/new' },
};

/** `/new` 라우트 진입점. `Home` 페이지 컴포넌트를 렌더링한다. */
export default function Page() {
  return <Home />;
}
