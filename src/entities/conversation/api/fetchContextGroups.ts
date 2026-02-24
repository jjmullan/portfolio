/**
 * @file fetchContextGroups.ts
 * @description Supabase `context_group` 테이블에서 최근 대화 내역 목록을 조회하는 API 모듈.
 * 사이드바 '최근 대화 내역' 초기 로드에 사용된다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { ConversationItem } from '../model/types';

/**
 * 최근 대화 내역 목록을 최신순으로 조회한다.
 *
 * @description
 * `context_group` 테이블에서 `context_group_id` 와 `subject` 를 최신순으로 최대 30개 조회한다.
 * `company_id` 가 null 인 경우(비공개 세션) 빈 배열을 즉시 반환한다.
 * `Navigation` 위젯 마운트 시 1회 호출하여 스토어를 초기화하는 데 사용된다.
 *
 * @param companyId - 조회할 `company_id`. null 이면 빈 배열 반환
 * @returns `ConversationItem` 배열 (최신순)
 * @throws Supabase 조회 오류 발생 시 에러를 throw
 */
export async function fetchContextGroups(companyId: string | null): Promise<ConversationItem[]> {
  if (!companyId) return [];

  const { data, error } = await supabase
    .from('context_group')
    .select('context_group_id, subject')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  return (data ?? []).map(({ context_group_id, subject }) => ({
    id: context_group_id,
    subject,
  }));
}
