import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SUMMARIZE_SYSTEM_PROMPT = `사용자가 입력한 텍스트를 30자 이내의 한 줄 제목으로 요약하세요.
- 반드시 한국어로 작성
- 핵심 키워드 위주로 간결하게
- 마침표, 물음표 등 문장 부호 제외
- 제목만 출력하고 다른 설명은 절대 포함하지 않음`;

export async function POST(request: NextRequest): Promise<Response> {
  const { prompt } = (await request.json()) as { prompt: string };

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 60,
    system: SUMMARIZE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const subject = message.content[0]?.type === 'text' ? message.content[0].text.trim() : prompt.slice(0, 30);

  return new Response(subject, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
