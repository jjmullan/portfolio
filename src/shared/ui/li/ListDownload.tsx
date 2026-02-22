'use client';

import { useCompanyName } from '@shared/model/store/company';
import type { ListLinkType } from '@shared/model/types/types';
import Image from 'next/image';

export default function ListDownload({ href, image, title }: ListLinkType) {
  const companyName = useCompanyName();
  const hasCompanyName = companyName !== '비공개';

  return (
    <li className="px-2 hover:bg-gray-100 rounded-md">
      <a href={href} download={hasCompanyName} className={`flex items-center gap-x-3 w-full h-9.5 ${!hasCompanyName && 'cursor-not-allowed'}`}>
        <Image src={`/icons/${image}.svg`} alt={image ?? ''} width={16} height={16} />
        <span className="text-sm">{title}</span>
      </a>
    </li>
  );
}
