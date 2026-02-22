import Anthropic from '@anthropic-ai/sdk';
import type { MessageStreamEvent } from '@anthropic-ai/sdk/resources/messages/messages';
import { PORTFOLIO_DATA } from '@shared/data/portfolioData';
import type { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `
당신은 프론트엔드 신입 개발자 최영준의 포트폴리오 AI 어시스턴트입니다.
채용 담당자의 질문에 최영준을 대신하여 친절하고 전문적으로 답변하세요.

답변 시 유의사항
- 반드시 한국어로 작성
- 불필요한 반응, 표현, 이모티콘 등 사용 자제
- 1000자 이내로 간결하게 작성

아래는 최영준에 대한 정보입니다. 이 정보를 근거로 답변하세요.
정보에 없는 내용은 "해당 정보는 확인이 필요합니다"라고 답변하세요.

${PORTFOLIO_DATA}`;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// 에러 메시지를 클라이언트가 식별할 수 있도록 접두사를 붙여 스트림으로 전달한다.
// Response 가 이미 반환된 이후에는 HTTP 상태 코드를 변경할 수 없기 때문이다.
const STREAM_ERROR_PREFIX = '[STREAM_ERROR]:';

export async function POST(request: NextRequest): Promise<Response> {
  const { messages } = (await request.json()) as { messages: Message[] };

  // system 을 배열로 전달하고 cache_control 을 설정하면 Anthropic 서버에 캐싱된다.
  // 첫 요청: Cache Write (토큰 비용 +25%), 이후 5분 이내 요청: Cache Read (토큰 비용 -90%)
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1_500, // 한국어 약 2,000자 수준
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' }, // 5분 마다 캐시 갱신
      },
    ],
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const event of stream as AsyncIterable<MessageStreamEvent>) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
        controller.enqueue(encoder.encode(`${STREAM_ERROR_PREFIX}${message}`));
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
