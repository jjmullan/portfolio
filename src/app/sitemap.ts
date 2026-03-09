/**
 * @file sitemap.ts
 * @description `sitemap.xml` 메타데이터 생성 함수.
 * 포트폴리오의 주요 페이지 URL, 변경 주기, 우선순위를 정의한다.
 */

import type { MetadataRoute } from 'next';

/**
 * `sitemap.xml` 메타데이터를 반환한다.
 *
 * @returns 각 페이지의 URL, `lastModified`, `changeFrequency`, `priority` 가 포함된 sitemap 배열
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://youngjune.dev/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://youngjune.dev/new',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://youngjune.dev/career',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://youngjune.dev/chat',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
