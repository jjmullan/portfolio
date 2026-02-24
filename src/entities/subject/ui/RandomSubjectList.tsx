'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchRandomSubjects, type SubjectItem } from '../api/fetchRandomSubjects';

/**
 * Supabase `context_group` 에서 무작위 subject 3개를 가져와 링크 목록으로 렌더링하는 컴포넌트.
 * 각 항목 클릭 시 해당 대화 내역 페이지(`/chat?context={id}`)로 이동한다.
 */
export default function RandomSubjectList() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    fetchRandomSubjects().then(setSubjects).catch(console.error);
  }, []);

  if (subjects.length === 0) return null;

  return (
    <>
      {subjects.map(({ context_group_id, subject }) => (
        <li key={context_group_id} className="px-3 py-2 text-xs bg-gray-50 rounded-full">
          <Link href={`/chat?context=${context_group_id}`}>{subject}</Link>
        </li>
      ))}
    </>
  );
}
