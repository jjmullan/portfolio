'use client';

/**
 * @file RandomSubjectList.tsx
 * @description Supabase `context_group` 에서 무작위 subject 3개를 조회하여 링크 목록으로 렌더링하는 컴포넌트.
 * 마운트 시 1회 호출하며, 로딩 중에는 스켈레톤 UI 를, 데이터가 없으면 기본 예시 항목을 표시한다.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchRandomSubjects, type SubjectItem } from '../api/fetchRandomSubjects';

/**
 * 무작위 대화 주제 3개를 링크 목록으로 렌더링하는 컴포넌트.
 *
 * @description
 * - 마운트 시 `fetchRandomSubjects` 를 호출하여 최대 3개의 주제를 조회한다.
 * - 로딩 중에는 `animate-pulse` 스켈레톤 UI 를 표시한다.
 * - 데이터가 없으면 하드코딩된 예시 항목 3개를 표시한다.
 * - 각 항목 클릭 시 `/chat?context={context_group_id}` 로 이동한다.
 */
export default function RandomSubjectList() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRandomSubjects();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 3개 스켈레톤 아이템에 index key 사용
          <li key={i} className="px-3 py-2 text-xs bg-gray-50 rounded-full animate-pulse h-8">
            <span className="block w-24 h-3 bg-gray-200 rounded-full" />
          </li>
        ))}
      </>
    );
  }

  if (subjects.length === 0)
    return (
      <>
        <li className="px-3 py-2 text-xs bg-gray-50 rounded-full truncate">우리 회사와의 직무 적합성을 분석해줘</li>
        <li className="px-3 py-2 text-xs bg-gray-50 rounded-full truncate">프로젝트 경험을 소개해줘</li>
        <li className="px-3 py-2 text-xs bg-gray-50 rounded-full truncate">본인만의 강점을 알려줘</li>
      </>
    );

  return (
    <>
      {subjects.map(({ context_group_id, subject }) => (
        <li key={context_group_id} className="px-3 py-2 text-xs max-w-[166px] bg-gray-50 rounded-full truncate">
          <Link href={`/chat?context=${context_group_id}`}>{subject}</Link>
        </li>
      ))}
    </>
  );
}
