/**
 * @file robots.ts
 * @description `robots.txt` 메타데이터 생성 함수.
 * 모든 크롤러에 전체 경로 접근을 허용하고, sitemap URL 을 명시한다.
 */

import type { MetadataRoute } from 'next';

/**
 * `robots.txt` 메타데이터를 반환한다.
 *
 * @returns 모든 `userAgent` 에 `'/'` 접근을 허용하는 robots 설정 객체
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://youngjune.dev/sitemap.xml',
  };
}
