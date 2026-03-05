import Chat from '@pages/Chat';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '대화 목록',
  alternates: { canonical: 'https://youngjune.dev/chat' },
};

// useSearchParams() 사용으로 Suspense 경계 필요
export default function Page() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
}
