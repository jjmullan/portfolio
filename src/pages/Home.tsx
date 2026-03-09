/**
 * @file Home.tsx
 * @description 홈(새 채팅 시작) 페이지 컴포넌트.
 * 채용 담당자 인사말, 다른 담당자가 검색한 무작위 주제 3개, 새 채팅 입력창을 렌더링한다.
 * 서버 컴포넌트로 유지하기 위해 Zustand 훅은 `HomeGreeting` 클라이언트 컴포넌트로 분리한다.
 */

import { RandomPromptList } from '@entities/subject';
import { NewChatBox } from '@features/chat';
import HomeGreeting from '../entities/company/ui/HomeGreeting';

/**
 * 홈(새 채팅 시작) 페이지 컴포넌트.
 *
 * @description
 * - 채용 담당자의 회사명을 포함한 인사말(`HomeGreeting`)을 표시한다.
 * - 다른 담당자가 검색한 무작위 주제 3개(`RandomPromptList`)를 링크 형태로 나열한다.
 * - 새 채팅 입력창(`NewChatBox`)을 통해 AI 대화를 시작할 수 있다.
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-full max-w-layout px-10 min-h-screen">
      <div className="flex flex-col w-full items-start justify-start gap-y-4 px-8">
        <HomeGreeting />
        <div className="flex flex-col gap-y-2.5 w-full">
          <p className="text-xs px-2">👇🏻 다른 채용 담당자는 이런 내용을 검색했어요!</p>
          <ul className="flex gap-1.5">
            <RandomPromptList />
          </ul>
        </div>
      </div>
      <NewChatBox />
    </div>
  );
}
