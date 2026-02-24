/**
 * @file fetchContextsByGroupId.ts
 * @description `context_group_id` 를 기준으로 Supabase `context` 테이블의 대화 기록을 조회하는 API 모듈.
 * 사이드바 '최근 대화 내역' 클릭 시 `/chat?context={id}` 로 진입했을 때 기존 대화 내역 복원에 사용된다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { ContextRecord } from '../model/types';

/**
 * `context_group_id` 에 해당하는 대화 기록을 오래된 순으로 조회한다.
 *
 * @description
 * `context` 테이블에서 주어진 `context_group_id` 와 일치하는 모든 대화 기록을 조회한다.
 * `created_at` 오름차순 정렬로 대화 순서를 보장하며,
 * `/chat` 페이지 진입 시 기존 대화 메시지를 복원하는 데 사용된다.
 *
 * @param contextGroupId - 조회할 `context_group_id`
 * @returns `ContextRecord` 배열 (생성순 오름차순)
 * @throws Supabase 조회 오류 발생 시 에러를 throw
 */
export async function fetchContextsByGroupId(contextGroupId: string): Promise<ContextRecord[]> {
  const { data, error } = await supabase
    .from('context')
    .select('input_context, output_context')
    .eq('context_group_id', contextGroupId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
