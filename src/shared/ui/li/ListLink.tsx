import type { ListInnerLinkType } from '@shared/model/type';
import Image from 'next/image';
import Link from 'next/link';
import { Activity } from 'react';

export default function ListLink({ href, title, image, isInnerLink = false }: ListInnerLinkType) {
  return (
    <li className="px-2 hover:bg-gray-100 rounded-md">
      <Link href={href} target={`${isInnerLink ? '' : '_blank'}`} rel="noopener noreferrer" className="flex items-center gap-x-2 w-full h-9 ">
        <Activity mode={image ? 'visible' : 'hidden'}>
          <Image src={`/icons/${image}.svg`} alt={image ?? ''} width={16} height={16} />
        </Activity>
        <span className="truncate">{title}</span>
      </Link>
    </li>
  );
}
