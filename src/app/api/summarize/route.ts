/**
 * @file route.ts
 * @description 사용자 입력 텍스트를 30자 이내의 한 줄 제목으로 요약하는 API Route Handler.
 * Claude Haiku 모델을 사용하며, `context_group.subject` 값 생성에 활용된다.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SUMMARIZE_SYSTEM_PROMPT = `사용자가 입력한 텍스트를 30자 이내의 한 줄 제목으로 요약하세요.
- 반드시 한국어로 작성
- 핵심 키워드 위주로 간결하게
- 마침표, 물음표 등 문장 부호 제외
- 제목만 출력하고 다른 설명은 절대 포함하지 않음`;

/**
 * 텍스트 요약 엔드포인트.
 *
 * @description
 * 요청 본문의 `prompt` 텍스트를 Claude Haiku 로 30자 이내의 한 줄 제목으로 요약한다.
 * `prompt` 가 비어있으면 400, API 키 미설정이면 500, Anthropic API 오류면 적절한 상태 코드를 반환한다.
 *
 * @param request - Next.js 요청 객체 (`{ prompt: string }` 형태의 JSON 본문)
 * @returns 요약된 한 줄 제목 문자열 또는 에러 메시지가 담긴 `Response`
 */
export async function POST(request: NextRequest): Promise<Response> {
  let prompt = '';
  try {
    const body = (await request.json()) as { prompt?: string };
    prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  } catch {
    return new Response('요약 요청 형식(JSON)이 올바르지 않습니다.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('서버 API 키가 설정되지 않았습니다.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (!prompt) {
    return new Response('요약할 텍스트가 비어 있습니다.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 60,
      system: SUMMARIZE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const subject = message.content[0]?.type === 'text' ? message.content[0].text.trim() : prompt.slice(0, 15);

    return new Response(subject, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return new Response('API 인증에 실패했습니다. 관리자에게 문의해주세요.', {
          status: 401,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      if (error.status === 429 || error.status === 529) {
        return new Response('요약 요청이 혼잡합니다. 잠시 후 다시 시도해주세요.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    }
    return new Response('요약 생성 중 오류가 발생했습니다.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
