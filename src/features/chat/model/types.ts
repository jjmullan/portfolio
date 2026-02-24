/**
 * @file types.ts
 * @description `features/chat` 슬라이스에서 사용하는 공유 타입 정의.
 */

/**
 * `InProgressChatBox` 컴포넌트의 Props 타입.
 *
 * @property contextGroupId - 현재 채팅 세션의 `context_group_id`.
 *   `context` 테이블 INSERT 시 외래 키로 사용되어 대화 내역을 추적한다.
 */
export type InProgressChatBoxType = {
  contextGroupId: string | null;
};

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
