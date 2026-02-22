import type { ChatMessageType } from '../model/useChatStore';

type SendMessageParams = {
  messages: Pick<ChatMessageType, 'role' | 'content'>[];
  onChunk: (chunk: string) => void;
  onDone: (fullResponse: string) => void;
  onError: (error: Error) => void;
};

// route.ts 에서 에러 발생 시 스트림에 삽입하는 접두사
const STREAM_ERROR_PREFIX = '[STREAM_ERROR]:';

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
