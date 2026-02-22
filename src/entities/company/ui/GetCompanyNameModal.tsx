'use client';

/**
 * @file GetCompanyNameModal.tsx
 * @description 포트폴리오 최초 진입 시 채용 담당자의 회사명을 수집하는 모달 컴포넌트.
 * `companyName` 이 `null` 인 경우(= 최초 접근) 자동으로 모달이 열리며,
 * 외부 클릭 및 ESC 키로 닫히지 않아 반드시 입력을 완료해야 한다.
 * Zustand persist 의 하이드레이션 완료 후에만 렌더링하여 SSR/CSR 불일치를 방지한다.
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/shadcn/dialog';
import { useCompanyName, useHasHydrated, useSetCompanyName } from '../../../shared/model/store/company';

/**
 * 채용 담당자 회사명 입력 모달 컴포넌트.
 *
 * @description
 * - `companyName === null` 이면 모달이 자동으로 열린다.
 * - 회사명 입력 완료 또는 '공개하고 싶지 않아요' 선택 시 모달이 닫힌다.
 * - `'비공개'` 를 선택한 경우 이력서 다운로드 기능이 비활성화된다.
 * - 하이드레이션 전에는 `null` 을 반환하여 렌더링을 지연시킨다.
 */
export default function GetCompanyNameModal() {
  const companyName = useCompanyName();
  const setCompanyName = useSetCompanyName();

  // 하이드레이션이 완료된 후 렌더링하는 로직 추가
  const hasHydrated = useHasHydrated();
  if (!hasHydrated) return null;

  /**
   * 회사명 폼 제출 핸들러.
   * 입력값이 없거나 공백인 경우 실행하지 않는다.
   *
   * @param formData - 폼 데이터 (company-name 필드 포함)
   */
  const handleSubmitCompanyName = (formData: FormData) => {
    if (!formData.get('company-name')) return;

    const value = formData.get('company-name') as string;
    if (!value.trim()) return;
    setCompanyName(value.trim());
  };

  return (
    // companyName 이 null 이면 최초 접근으로 판단하여 모달 자동 팝업
    <Dialog open={companyName === null}>
      <DialogContent
        // 외부 클릭 및 ESC 키로 모달이 닫히지 않도록 방지
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="gap-y-1">
        <DialogHeader>
          <DialogTitle>안녕하세요 채용 담당자님!</DialogTitle>
          <DialogDescription>회사명을 입력해주시면, 제게 큰 도움이 됩니다😊</DialogDescription>
        </DialogHeader>
        <form action={handleSubmitCompanyName} className="flex flex-col gap-3 mt-2">
          <label htmlFor="company-name" className="sr-only">
            회사명
          </label>
          <input
            id="company-name"
            name="company-name"
            type="text"
            placeholder="회사명"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-gray-400"
            autoFocus
            required
            maxLength={30}
          />
          <div className="flex flex-col gap-y-2">
            <button type="submit" className="bg-black text-white rounded-lg px-4 py-2 text-sm cursor-pointer w-full font-bold">
              입력 완료
            </button>
            <button
              type="button"
              className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-black/80 cursor-pointer w-full"
              onClick={() => setCompanyName('비공개')}>
              공개하고 싶지 않아요
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
