import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PromptType } from '@shared/model/types/types';

const PROMPT_DIR = path.join(process.cwd(), 'prompt');

export async function loadTemplate(key: PromptType): Promise<string> {
  const filePath = path.join(PROMPT_DIR, `${key}.md`);
  return readFile(filePath, 'utf-8');
}

export async function loadAllTemplates(keys: readonly PromptType[]) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const content = await loadTemplate(key);
      return [key, content] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<PromptType, string>;
}
