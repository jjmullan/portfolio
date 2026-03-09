/**
 * @file fetchRandomSubjects.ts
 * @description `context_group` 테이블에서 최대 30개의 subject 를 조회하고,
 * 클라이언트 사이드에서 섞어 무작위 3개를 반환하는 API 모듈.
 * 홈 페이지의 '다른 담당자가 검색한 내용' 영역에서 사용된다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';

/**
 * 대화 주제 단일 항목 타입.
 *
 * @property context_group_id - `context_group` 테이블의 PK (UUID)
 * @property subject - AI 가 요약한 한 줄 제목
 */
export type SubjectItem = {
  context_group_id: string;
  subject: string;
};

/**
 * `context_group` 테이블에서 subject 를 조회한 뒤 클라이언트 사이드에서 섞어 최대 3개를 반환한다.
 *
 * @returns 무작위로 선택된 최대 3개의 `SubjectItem` 배열
 * @throws Supabase 조회 오류 발생 시 에러를 throw
 */
export async function fetchRandomSubjects(): Promise<SubjectItem[]> {
  const { data, error } = await supabase
    .from('context_group')
    .select('context_group_id, subject')
    .neq('subject', '')
    .limit(30);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  return [...data].sort(() => Math.random() - 0.5).slice(0, 3);
}
