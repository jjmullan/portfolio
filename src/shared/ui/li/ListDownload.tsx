'use client';

/**
 * @file ListDownload.tsx
 * @description 파일 다운로드 링크 목록의 개별 아이템 컴포넌트.
 * 채용 담당자가 회사명을 '비공개'로 설정한 경우 다운로드를 비활성화한다.
 */

import { useCompanyName } from '@shared/model/store/company';
import type { ListLinkType } from '@shared/model/types/types';
import Image from 'next/image';

/**
 * 파일 다운로드 링크 목록의 개별 아이템 컴포넌트.
 *
 * @description
 * - `companyName` 이 `'비공개'` 인 경우 `download` 속성을 비활성화하고 `cursor-not-allowed` 를 적용한다.
 * - 회사명을 공개한 경우에만 파일 다운로드가 가능하다.
 *
 * @param props.href - 다운로드 파일 URL
 * @param props.image - `/icons/` 디렉토리의 SVG 파일명 (확장자 제외)
 * @param props.title - 표시할 텍스트
 */
export default function ListDownload({ href, image, title }: ListLinkType) {
  const companyName = useCompanyName();
  const hasCompanyName = companyName !== '비공개';

  return (
    <li className="px-2 hover:bg-gray-100 rounded-md">
      <a
        href={hasCompanyName ? href : ''}
        download={hasCompanyName ? true : undefined}
        onClick={(e) => {
          if (!hasCompanyName) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex items-center gap-x-3 w-full h-9.5 ${!hasCompanyName && 'cursor-not-allowed'}`}>
        <Image src={`/icons/${image}.svg`} alt={image ?? ''} width={16} height={16} />
        <span className="text-sm">{title}</span>
      </a>
    </li>
  );
}
