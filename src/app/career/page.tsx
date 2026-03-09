/**
 * @file page.tsx
 * @description `/career` 라우트 페이지.
 * 이력(경력, 학력, 자격증 등) 목록 페이지(`Career`)를 렌더링한다.
 * 경력 페이지 로딩 중에는 `src/app/loading.tsx` 의 스켈레톤 UI 가 표시된다.
 */

import Career from '@pages/Career';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '성장 과정',
  alternates: { canonical: 'https://youngjune.dev/career' },
};

/** `/career` 라우트 진입점. `Career` 페이지 컴포넌트를 렌더링한다. */
export default function Page() {
  return <Career />;
}
