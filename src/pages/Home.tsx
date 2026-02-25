'use client';

import { RandomPromptList } from '@entities/subject';
import { NewChatBox } from '@features/chat';
import { useCompanyName } from '@shared/model/store/company';

export default function Home() {
  const companyName = useCompanyName();

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-full max-w-[640px] px-10 min-h-screen">
      <div className="flex flex-col w-full items-start justify-start gap-y-4 px-8">
        <div className="flex flex-col w-full text-[28px]">
          <p>
            안녕하세요, <span>{companyName !== '비공개' && companyName !== null && companyName}</span> 채용 담당자님
          </p>
          <p>프론트엔드 신입 개발자 최영준입니다</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-xs px-2">다른 채용 담당자는 이런 내용을 검색했어요</p>
          <ul className="flex gap-1.5">
            <RandomPromptList />
          </ul>
        </div>
      </div>
      <NewChatBox />
    </div>
  );
}
