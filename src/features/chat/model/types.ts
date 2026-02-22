/**
 * `InProgressChatBox` 컴포넌트의 Props 타입.
 *
 * @property onMessageSent - AI 응답 수신 완료 시 호출되는 콜백.
 *   `inputContext` 는 사용자 입력 텍스트, `outputContext` 는 AI 의 전체 응답 텍스트.
 *   Supabase `context` 테이블에 대화 기록을 저장하는 용도로 사용된다.
 */
export type InProgressChatBoxType = {
  onMessageSent: (inputContext: string, outputContext: string) => void;
};
