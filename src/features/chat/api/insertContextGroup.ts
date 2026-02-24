/**
 * @file insertContextGroup.ts
 * @description Supabase `context_group` 테이블에 새 채팅 그룹을 생성하는 API 모듈.
 * 새 채팅 세션 시작 시 호출되며, 생성된 `context_group_id` 를 반환한다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { TablesInsert } from '@shared/model/types/supabase.type';

/**
 * Supabase `context_group` 테이블에 새 채팅 그룹을 삽입하고 `context_group_id` 를 반환한다.
 *
 * @description
 * 새 채팅 세션이 시작될 때 `/new` 페이지에서 호출된다.
 * `company_name` 은 채용 담당자가 입력한 경우에만 포함된다.
 * 삽입 성공 시 생성된 `context_group_id` 를 반환하며, 실패 시 Supabase 에러를 throw 한다.
 *
 * @param contextGroup - 삽입할 컨텍스트 그룹 데이터 (`TablesInsert<'context_group'>` 타입)
 * @returns 생성된 `context_group_id` (UUID 문자열)
 * @throws Supabase 삽입 오류 발생 시 에러를 throw
 *
 * @example
 * const contextGroupId = await insertContextGroup({ company_name: '(주)예시' });
 */
export async function insertContextGroup(contextGroup: TablesInsert<'context_group'>): Promise<string> {
  const { data, error } = await supabase
    .from('context_group')
    .insert(contextGroup)
    .select('context_group_id')
    .single();
  if (error) throw error;
  return data.context_group_id;
}
