import type { H2Type } from '@shared/model/type';

export default function H2({ title, isSrOnly = false }: H2Type) {
  return <h2 className={`${isSrOnly && 'sr-only'} h-7 text-sm flex items-center`}>{title}</h2>;
}
