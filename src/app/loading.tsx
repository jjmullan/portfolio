/**
 * @file loading.tsx
 * @description 페이지 로딩 중 표시되는 스켈레톤 UI 컴포넌트.
 * Next.js App Router 가 페이지 전환 시 자동으로 렌더링한다.
 * `animate-pulse` 로 이력 목록 형태의 스켈레톤을 표시한다.
 */

/**
 * 경력 페이지 로딩 스켈레톤 UI 컴포넌트.
 *
 * @description
 * 5개의 이력 항목 형태로 기간, 뱃지, 타이틀, 설명 스켈레톤을 렌더링한다.
 * `animate-pulse` 로 로딩 상태를 시각적으로 표현한다.
 */
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
