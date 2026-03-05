import { RandomPromptList } from '@entities/subject';
import { NewChatBox } from '@features/chat';
import HomeGreeting from '../entities/company/ui/HomeGreeting';

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
