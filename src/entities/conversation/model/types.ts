/**
 * @file types.ts
 * @description `entities/conversation` 슬라이스에서 사용하는 공유 타입 정의.
 */

/**
 * 사이드바 최근 대화 내역 아이템 타입.
 *
 * @property id - `context_group_id` (UUID)
 * @property subject - AI 가 요약한 한 줄 제목
 */
export type ConversationItem = {
  id: string;
  subject: string;
};

/**
 * 단일 대화 기록 항목 타입.
 * `context` 테이블의 input/output 쌍을 나타낸다.
 */
export type ContextRecord = {
  input_context: string;
  output_context: string;
};
