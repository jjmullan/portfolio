/**
 * @file insertCompany.ts
 * @description Supabase `company` 테이블에 채용 담당자 정보를 삽입하는 API 모듈.
 * 최초 페이지 접근 시 회사명 입력 완료 후 호출되며, 생성된 `company_id` 를 반환한다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { TablesInsert } from '@shared/model/types/supabase.type';

/**
 * Supabase `company` 테이블에 채용 담당자 정보를 삽입하고 `company_id` 를 반환한다.
 *
 * @description
 * 최초 페이지 접근 시 회사명 입력 모달에서 호출된다.
 * 삽입 성공 시 생성된 `company_id` (UUID) 를 반환하며, 실패 시 Supabase 에러를 throw 한다.
 * '비공개' 선택 시에는 호출하지 않으며, `company_id` 는 `null` 로 유지된다.
 *
 * @param company - 삽입할 회사 데이터 (`TablesInsert<'company'>` 타입)
 * @returns 생성된 `company_id` (UUID 문자열)
 * @throws Supabase 삽입 오류 발생 시 에러를 throw
 *
 * @example
 * const companyId = await insertCompany({ company_name: '(주)예시' });
 */
export async function insertCompany(company: TablesInsert<'company'>): Promise<string> {
  const { data, error } = await supabase.from('company').insert(company).select('company_id').single();

  if (error) throw error;
  return data.company_id;
}
