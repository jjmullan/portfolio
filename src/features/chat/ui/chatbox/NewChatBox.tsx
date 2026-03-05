/**
 * @file NewChatBox.tsx
 * @description 새 채팅을 시작하는 메시지 입력 컴포넌트.
 * 홈 화면에서 사용자의 첫 질문을 입력받아 `/chat` 페이지로 이동시킨다.
 * 입력값은 URL 쿼리 파라미터(`context`)로 전달되며,
 * Supabase INSERT 는 AI 응답 완료 후 `/chat` 페이지에서 처리한다.
 *
 * @description
 * placeholder 랜덤 선택을 서버 컴포넌트에서 처리하여 Hydration 오류를 방지한다.
 * 클라이언트 로직은 `NewChatBoxClient` 에 위임한다.
 */

import { EXAMPLE } from '../../model/constants';
import NewChatBoxClient from './NewChatBoxClient';

export default function NewChatBox() {
  const placeholder = EXAMPLE[Math.floor(Math.random() * EXAMPLE.length)]!.title;

  return <NewChatBoxClient placeholder={placeholder} />;
}
