import type { H2Type } from '@shared/model/type';

export default function H2({ title, isSrOnly = false, isHidden = false }: H2Type) {
  return (
    <h2 className={`${isSrOnly && 'sr-only'} h-7 text-xs text-black/80 font-medium flex items-center`} hidden={isHidden}>
      {title}
    </h2>
  );
}
