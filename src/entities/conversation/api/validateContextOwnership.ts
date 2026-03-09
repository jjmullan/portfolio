/**
 * @file validateContextOwnership.ts
 * @description `context_group_id` 와 `company_id` 의 소유권 일치 여부를 검증하는 API 모듈.
 * 채팅 페이지 진입 시 다른 회사의 대화 내역에 접근하는 것을 방지한다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';

/**
 * 주어진 `context_group_id` 가 현재 세션의 `company_id` 소유인지 검증한다.
 *
 * @description
 * `context_group` 테이블에서 `context_group_id` 에 해당하는 행의 `company_id` 를 조회하고,
 * 현재 세션의 `company_id` 와 일치하는지 비교한다.
 * 일치하면 `true`, 불일치하거나 조회 실패 시 `false` 를 반환한다.
 *
 * @param contextGroupId - 검증할 `context_group_id`
 * @param companyId - 세션 스토리지에 저장된 현재 `company_id`
 * @returns 소유권이 일치하면 `true`, 그렇지 않으면 `false`
 */
export async function validateContextOwnership(contextGroupId: string, companyId: string): Promise<boolean> {
  const { data } = await supabase
    .from('context_group')
    .select('company_id')
    .eq('context_group_id', contextGroupId)
    .single();

  return data?.company_id === companyId;
}
