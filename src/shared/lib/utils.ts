import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 조건부로 결합하고 충돌을 자동으로 해결하는 유틸리티 함수.
 *
 * @description
 * `clsx` 로 조건부 클래스 배열을 문자열로 변환하고,
 * `tailwind-merge` 로 동일 속성의 Tailwind 클래스 충돌을 해결한다.
 * shadcn/ui 컴포넌트의 `className` 병합에 주로 사용된다.
 *
 * @param inputs - 조합할 클래스 값 목록 (문자열, 객체, 배열 등 `ClassValue` 허용)
 * @returns 병합 및 충돌이 해결된 Tailwind 클래스 문자열
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // → 'py-2 bg-blue-500 px-6' (px-4 가 px-6 으로 대체됨)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
