/**
 * @file sendMessage.ts
 * @description Claude AI API 와의 스트리밍 통신을 담당하는 모듈.
 * `/api/chat` Route Handler 에 POST 요청을 보내고, `ReadableStream` 으로 응답을 청크 단위로 수신한다.
 */

import type { ChatMessageType } from '../model/useChatStore';

/**
 * `sendMessage` 함수에 전달하는 파라미터 타입.
 *
 * @property messages - AI 에게 전달할 대화 히스토리 배열. `role` 과 `content` 만 포함한다.
 * @property onChunk - 스트리밍 청크를 수신할 때마다 호출되는 콜백. UI 실시간 업데이트에 사용한다.
 * @property onDone - 스트리밍이 완료되었을 때 전체 응답 텍스트와 함께 호출되는 콜백.
 * @property onError - 네트워크 오류 또는 서버 에러 발생 시 호출되는 콜백.
 */
type SendMessageParams = {
  messages: Pick<ChatMessageType, 'role' | 'content'>[];
  onChunk: (chunk: string) => void;
  onDone: (fullResponse: string) => void;
  onError: (error: Error) => void;
};

/** route.ts 에서 에러 발생 시 스트림에 삽입하는 접두사 */
const STREAM_ERROR_PREFIX = '[STREAM_ERROR]:';

/**
 * Claude AI API 에 메시지를 전송하고 스트리밍 응답을 처리한다.
 *
 * @description
 * `/api/chat` Route Handler 에 POST 요청을 전송하고, `ReadableStream` 을 통해 응답을 청크 단위로 읽는다.
 * 각 청크는 `onChunk` 콜백으로 즉시 전달되어 UI 에 실시간으로 반영된다.
 * 스트리밍이 완료되면 `onDone` 이 호출되고, 오류 발생 시 `onError` 가 호출된다.
 * 서버가 스트림에 `[STREAM_ERROR]:` 접두사를 삽입한 경우 스트리밍 도중 에러로 처리한다.
 *
 * @param params - 메시지 배열 및 스트리밍 이벤트 콜백 함수
 * @returns 스트리밍 처리가 완료되면 resolve 되는 `Promise<void>`
 *
 * @example
 * await sendMessage({
 *   messages: [{ role: 'user', content: '안녕하세요' }],
 *   onChunk: (chunk) => appendToUI(chunk),
 *   onDone: (fullResponse) => saveToHistory(fullResponse),
 *   onError: (error) => showErrorMessage(error.message),
 * });
 */
export async function sendMessage({ messages, onChunk, onDone, onError }: SendMessageParams): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) throw new Error(`API 오류: ${response.status}`);
    if (!response.body) throw new Error('응답 스트림이 없습니다');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // 스트리밍 도중 서버에서 에러가 발생한 경우
      if (chunk.startsWith(STREAM_ERROR_PREFIX)) {
        const message = chunk.slice(STREAM_ERROR_PREFIX.length);
        onError(new Error(message));
        return;
      }

      fullResponse += chunk;
      onChunk(chunk);
    }

    onDone(fullResponse);
  } catch (error) {
    onError(error instanceof Error ? error : new Error('알 수 없는 오류'));
  }
}
