/**
 * @file H2.tsx
 * @description 섹션 제목용 `<h2>` 공통 컴포넌트.
 * 스크린 리더 전용 표시(`sr-only`)와 완전 숨김(`hidden`) 옵션을 제공한다.
 */

import type { H2Type } from '@shared/model/types/types';

/**
 * 섹션 제목을 렌더링하는 `<h2>` 공통 컴포넌트.
 *
 * @param props.title - 표시할 제목 텍스트
 * @param props.isSrOnly - `true` 이면 `sr-only` 클래스를 적용하여 스크린 리더에서만 읽힌다 (기본값: `false`)
 * @param props.isHidden - `true` 이면 `hidden` 속성을 적용하여 레이아웃에서도 완전히 제거한다 (기본값: `false`)
 */
export default function H2({ title, isSrOnly = false, isHidden = false }: H2Type) {
  return (
    <h2 className={`${isSrOnly && 'sr-only'} h-7 text-xs text-black/80 font-medium flex items-center`} hidden={isHidden}>
      {title}
    </h2>
  );
}
