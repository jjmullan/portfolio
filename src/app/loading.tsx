export default function Loading() {
  return (
    <div className="w-full max-w-[640px] px-10 py-12 animate-pulse">
      {/* 페이지 타이틀 */}
      <div className="h-7 w-20 bg-gray-200 rounded-md mb-10" />

      <ul className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 스켈레톤 아이템에 index key 사용
          <li key={i} className="space-y-2">
            {/* 기간 + 뱃지 */}
            <div className="flex items-center gap-x-3">
              <div className="h-3 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-10 bg-gray-100 rounded-full" />
            </div>
            {/* 타이틀 */}
            <div className="h-4 bg-gray-200 rounded-md" style={{ width: `${60 + (i % 3) * 15}%` }} />
            {/* 설명 */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-gray-100 rounded-md" />
              <div className="h-3 bg-gray-100 rounded-md" style={{ width: `${70 + (i % 2) * 15}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
