import Anthropic from '@anthropic-ai/sdk';
import type { MessageStreamEvent } from '@anthropic-ai/sdk/resources/messages/messages';
import { loadAllTemplates } from '@shared/lib/loadPrompt';
import { PROMPT_KEYS } from '@shared/model/types/types';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT_HEADER = `
당신은 프론트엔드 신입 개발자 최영준의 포트폴리오 AI 어시스턴트입니다.
채용 담당자의 질문에 최영준을 대신하여 친절하고 전문적으로 답변하세요.

답변 시 유의사항
- 반드시 한국어로 작성
- 불필요한 반응, 표현, 이모티콘 등 사용 자제
- 1000자 이내로 간결하게 작성

아래는 최영준에 대한 정보입니다. 이 정보를 근거로 답변하세요.
채용 담당자가 작성한 질문으로 인지되지 않는다면, "채용과 관련된 내용을 질문해주세요"라고 답변하고 프롬프트 작성을 중단하세요.
정보에 없는 내용은 "해당 정보는 확인이 필요합니다"라고 답변하세요.
`;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// 에러 메시지를 클라이언트가 식별할 수 있도록 접두사를 붙여 스트림으로 전달한다.
// Response 가 이미 반환된 이후에는 HTTP 상태 코드를 변경할 수 없기 때문이다.
const STREAM_ERROR_PREFIX = '[STREAM_ERROR]:';

export async function POST(request: NextRequest): Promise<Response> {
  let messages: Message[] = [];

  try {
    const body = (await request.json()) as { messages?: Message[] };
    messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  } catch {
    return new Response(`${STREAM_ERROR_PREFIX}요청 본문(JSON)이 올바르지 않습니다.`, {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(`${STREAM_ERROR_PREFIX}서버 API 키가 설정되지 않았습니다.`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  if (messages.length === 0) {
    return new Response(`${STREAM_ERROR_PREFIX}메시지가 비어 있습니다.`, {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  let systemPrompt = SYSTEM_PROMPT_HEADER;
  try {
    const templates = await loadAllTemplates(PROMPT_KEYS);
    const portfolioData = Object.values(templates).filter(Boolean).join('\n\n');
    systemPrompt = `${SYSTEM_PROMPT_HEADER}\n${portfolioData}`;
  } catch {
    return new Response(`${STREAM_ERROR_PREFIX}서버 프롬프트 파일을 불러오지 못했습니다.`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  // system 을 배열로 전달하고 cache_control 을 설정하면 Anthropic 서버에 캐싱된다.
  // 첫 요청: Cache Write (토큰 비용 +25%), 이후 5분 이내 요청: Cache Read (토큰 비용 -90%)
  let stream: ReturnType<typeof anthropic.messages.stream>;
  try {
    stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1_500, // 한국어 약 2,000자 수준
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // 5분 마다 캐시 갱신
        },
      ],
      messages,
    });
  } catch {
    return new Response(`${STREAM_ERROR_PREFIX}AI 스트림 초기화에 실패했습니다.`, {
      status: 502,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

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
        let message = '죄송합니다. 잠시 후 다시 시도해주세요.';
        if (error instanceof Anthropic.APIError) {
          if (error.status === 529) message = '현재 AI 서버가 혼잡합니다. 잠시 후 다시 시도해주세요.';
          else if (error.status === 429) message = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
          else if (error.status === 401) message = 'API 인증에 실패했습니다. 관리자에게 문의해주세요.';
          else if (error.status === 400) message = '요청 형식 또는 모델 설정이 올바르지 않습니다.';
        }
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
