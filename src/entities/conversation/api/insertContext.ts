/**
 * @file insertContext.ts
 * @description Supabase `context` 테이블에 채팅 기록을 삽입하는 API 모듈.
 * 채용 담당자의 질문(input_context)과 AI 응답(output_context)을 한 쌍으로 저장한다.
 * 삽입 완료 후 DB 트리거(`trigger_update_context_group_updated_at`)가 자동으로 `context_group.updated_at` 을 갱신한다.
 */

import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { TablesInsert } from '@shared/model/types/supabase.type';

/**
 * Supabase `context` 테이블에 채팅 컨텍스트를 삽입한다.
 *
 * @description
 * AI 응답이 완료된 후 `/chat` 페이지에서 호출된다.
 * `input_context` (사용자 질문) 와 `output_context` (AI 전체 응답) 를 함께 저장한다.
 * `context_group.updated_at` 갱신은 DB 트리거가 자동으로 처리하므로 별도 쿼리가 필요없다.
 * 삽입 실패 시 Supabase 에러를 throw 한다.
 *
 * @param context - 삽입할 컨텍스트 데이터 (`TablesInsert<'context'>` 타입)
 * @returns 삽입 성공 시 데이터 또는 `null`
 * @throws Supabase 삽입 오류 발생 시 에러를 throw
 *
 * @example
 * await insertContext({
 *   context_group_id: 'uuid',
 *   input_context: '자기소개 해주세요',
 *   output_context: '안녕하세요, 최영준입니다...',
 * });
 */
export async function insertContext(context: TablesInsert<'context'>) {
  const { data, error } = await supabase.from('context').insert(context);
  if (error) throw error;
  return data;
}
