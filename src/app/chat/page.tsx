import Chat from '@pages/Chat';
import { Suspense } from 'react';

// useSearchParams() 사용으로 Suspense 경계 필요
export default function Page() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
}
