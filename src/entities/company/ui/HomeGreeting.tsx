'use client';

/**
 * @file HomeGreeting.tsx
 * @description 채용 담당자 회사명을 표시하는 인사말 클라이언트 컴포넌트.
 * Home 페이지를 서버 컴포넌트로 유지하기 위해 Zustand 훅 사용 부분을 분리하였다.
 */

import { useCompanyName } from '@shared/model/store/company';

export default function HomeGreeting() {
  const companyName = useCompanyName();

  return (
    <div className="flex flex-col w-full text-[28px]">
      <p>
        안녕하세요, <span className="font-semibold">{companyName !== '비공개' && companyName !== null && companyName}</span> 채용 담당자님
      </p>
      <p>프론트엔드 신입 개발자 최영준입니다</p>
    </div>
  );
}