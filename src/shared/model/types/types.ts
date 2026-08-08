/**
 * 사이드바 링크 목록 항목의 기본 Props 타입.
 *
 * @property href - 링크 URL
 * @property title - 표시할 텍스트
 * @property image - `/icons/` 디렉토리의 SVG 파일명 (확장자 제외, 선택)
 */
export type ListLinkType = {
  href: string;
  title: string;
  image?: string;
};

/**
 * `ListLinkType` 을 확장한 내/외부 링크 구분 Props 타입.
 *
 * @property isInnerLink - `true` 이면 같은 탭에서 이동 (내부 링크), `false` 이면 새 탭으로 열림 (기본값: `false`)
 * @property isHidden - `true` 이면 `hidden` 속성을 적용하여 시각적으로 숨김 (기본값: `false`)
 */
export type ListInnerLinkType = ListLinkType & { isInnerLink?: boolean; isHidden?: boolean };

/**
 * `H2` 제목 컴포넌트의 Props 타입.
 *
 * @property title - 표시할 제목 텍스트
 * @property isSrOnly - `true` 이면 스크린 리더 전용으로만 표시 (`sr-only` 클래스 적용, 기본값: `false`)
 * @property isHidden - `true` 이면 `hidden` 속성으로 완전히 숨김 (기본값: `false`)
 */
export type H2Type = {
  title: string;
  isSrOnly?: boolean;
  isHidden?: boolean;
};

export const PROMPT_KEYS = ['01_resume', '02_project', '03_cover-letter', '04_career', '05_etc-experience'] as const;
export type PromptType = (typeof PROMPT_KEYS)[number];
