import { supabase } from '@shared/lib/supabase/supabaseClient';

/**
 * 주어진 `context_group_id` 가 현재 세션의 `company_id` 소유인지 검증한다.
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
