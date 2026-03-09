/**
 * @file constants.ts
 * @description 채팅 입력창 placeholder 로 사용되는 예시 질문 상수.
 * `NewChatBox` 서버 컴포넌트에서 무작위로 하나를 선택하여 `placeholder` 로 전달한다.
 */

/** 채팅 입력창 `placeholder` 로 사용하는 예시 질문 목록 */
export const EXAMPLE: { title: string }[] = [
  { title: '예시: 사용자 경험을 개선했던 경험이 있나요?' },
  { title: '예시: 폴더 구조를 설계한 경험이 있나요?' },
  { title: '예시: 어려웠던 문제를 해결한 경험이 있나요?' },
  { title: '예시: 가장 큰 강점은 무엇인가요?' },
  { title: '예시: 이력서 내용을 요악해주세요' },
  { title: '예시: 보유한 개발 스택을 경험과 연결하여 알려주세요' },
  { title: '예시: 개발자가 되기 위해 어떤 과정을 거쳤나요?' },
  { title: '예시: 프로젝트 경험을 소개해주세요' },
];
