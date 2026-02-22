'use client';

import { useCompanyName } from '@shared/model/store/company';
/**
 * @file ListLink.tsx
 * @description 사이드바 링크 목록의 개별 아이템 컴포넌트.
 * 내부/외부 링크 여부에 따라 새 탭 열기 여부를 결정하고, 아이콘 이미지를 선택적으로 표시한다.
 */

import type { ListInnerLinkType } from '@shared/model/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { Activity } from 'react';

/**
 * 사이드바 링크 목록의 개별 아이템 컴포넌트.
 *
 * @description
 * - `isInnerLink` 가 `false` 이면 `target="_blank"` 로 새 탭에서 열린다.
 * - `image` 가 존재하면 `/icons/{image}.svg` 를 아이콘으로 표시한다.
 * - `isHidden` 이 `true` 이면 텍스트에 `hidden` 속성을 적용하여 숨긴다.
 *
 * @param props.href - 링크 URL
 * @param props.title - 표시할 텍스트
 * @param props.image - `/icons/` 디렉토리의 SVG 파일명 (확장자 제외, 선택)
 * @param props.isInnerLink - 내부 링크 여부 (기본값: `false`)
 * @param props.isHidden - 텍스트 숨김 여부 (기본값: `false`)
 */
export default function ListLink({ href, title, image, isInnerLink = false, isHidden = false }: ListInnerLinkType) {
  const companyName = useCompanyName();
  const hasCompanyName = companyName !== '비공개';
  const isGoogleDrive = title === 'Google Drive';
  const disabled = !hasCompanyName && isGoogleDrive;

  return (
    <li className="px-2 hover:bg-gray-100 rounded-md">
      <Link
        href={href}
        target={`${isInnerLink ? '' : '_blank'}`}
        rel="noopener noreferrer"
        className={`flex items-center gap-x-3 w-full h-9.5 ${disabled && 'cursor-not-allowed'}`}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}>
        <Activity mode={image ? 'visible' : 'hidden'}>
          <Image src={`/icons/${image}.svg`} alt={image ?? ''} width={16} height={16} />
        </Activity>
        <span className="truncate text-sm" hidden={isHidden}>
          {title}
        </span>
      </Link>
    </li>
  );
}
