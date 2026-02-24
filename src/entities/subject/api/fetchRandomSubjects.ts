import { supabase } from '@shared/lib/supabase/supabaseClient';

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
