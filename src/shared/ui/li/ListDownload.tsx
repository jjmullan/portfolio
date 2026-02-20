import type { ListLinkType } from '@shared/model/type';
import Image from 'next/image';

export default function ListDownload({ href, image, title }: ListLinkType) {
  return (
    <li className="px-2 hover:bg-gray-100 rounded-md">
      <a href={href} download className="flex items-center gap-x-3 w-full h-9.5">
        <Image src={`/icons/${image}.svg`} alt={image ?? ''} width={20} height={20} />
        {title}
      </a>
    </li>
  );
}
