/**
 * @file loadPrompt.ts
 * @description 서버 전용 프롬프트 템플릿 파일 로드 유틸리티.
 * `prompt/` 디렉토리의 Markdown 파일을 읽어 AI 시스템 프롬프트 구성에 활용한다.
 * `server-only` 패키지로 클라이언트 번들에 포함되는 것을 방지한다.
 */

import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PromptType } from '@shared/model/types/types';

const PROMPT_DIR = path.join(process.cwd(), 'prompt');

/**
 * 단일 프롬프트 템플릿 파일을 읽어 문자열로 반환한다.
 *
 * @param key - 읽을 프롬프트 파일의 키 (`PromptType`)
 * @returns 해당 `.md` 파일의 텍스트 내용
 * @throws 파일이 존재하지 않거나 읽기 권한이 없는 경우 에러를 throw
 */
export async function loadTemplate(key: PromptType): Promise<string> {
  const filePath = path.join(PROMPT_DIR, `${key}.md`);
  return readFile(filePath, 'utf-8');
}

/**
 * 여러 프롬프트 키에 대한 템플릿을 병렬로 읽어 `Record` 형태로 반환한다.
 *
 * @param keys - 읽을 프롬프트 키 배열 (`readonly PromptType[]`)
 * @returns 키와 파일 내용의 매핑 (`Record<PromptType, string>`)
 * @throws 하나라도 파일 읽기에 실패하면 에러를 throw
 *
 * @example
 * const templates = await loadAllTemplates(['01_resume', '02_project']);
 * // → { '01_resume': '...', '02_project': '...' }
 */
export async function loadAllTemplates(keys: readonly PromptType[]) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const content = await loadTemplate(key);
      return [key, content] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<PromptType, string>;
}
