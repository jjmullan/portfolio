/**
 * @file summarizeContext.ts
 * @description 사용자 입력 프롬프트를 AI 가 한 줄로 요약하는 API 모듈.
 * `/api/summarize` Route Handler 를 호출하여 `context_group.subject` 값을 생성한다.
 */

/**
 * 사용자 입력 프롬프트를 한 줄 제목으로 요약한다.
 *
 * @description
 * `/api/summarize` 에 POST 요청을 보내 Claude Haiku 가 생성한 요약 텍스트를 반환한다.
 * 요청 실패 시 원본 프롬프트를 30자로 잘라 폴백으로 사용한다.
 *
 * @param prompt - 요약할 사용자 입력 텍스트
 * @returns 한 줄 요약 문자열
 *
 * @example
 * const subject = await summarizeContext('React 와 Vue 의 차이점이 궁금합니다');
 * // → '리액트와 뷰의 차이점'
 */
export async function summarizeContext(prompt: string): Promise<string> {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) return prompt.slice(0, 15);
  return response.text();
}
