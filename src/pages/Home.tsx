'use client';

import { NewChatBox } from '@features/chat';
import { useCompanyName } from '@shared/model/store/company';

import Link from 'next/link';

export default function Home() {
  const companyName = useCompanyName();

  return (
    <div className="flex flex-col items-center justify-center gap-y-10 w-full max-w-[640px] px-10 min-h-screen">
      <div className="flex flex-col w-full items-start justify-start gap-y-3 px-8">
        <div className="flex flex-col w-full text-[28px]">
          <p>
            안녕하세요, <span>{companyName !== '비공개' && companyName !== null && companyName}</span> 채용 담당자님
          </p>
          <p>프론트엔드 신입 개발자 최영준입니다</p>
        </div>
        <ul className="flex gap-1.5">
          <li className="px-3 py-2 text-xs bg-gray-50 rounded-full">
            <Link href={`/chat?context=`}>질문 1</Link>
          </li>
          <li className="px-3 py-2 text-xs bg-gray-50 rounded-full">
            <Link href={`/chat?context=`}>질문 2</Link>
          </li>
          <li className="px-3 py-2 text-xs bg-gray-50 rounded-full">
            <Link href={`/chat?context=`}>질문 3</Link>
          </li>
        </ul>
      </div>
      <NewChatBox />
    </div>
  );
}
