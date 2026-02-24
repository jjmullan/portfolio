'use client';

/**
 * @file GetCompanyNameModal.tsx
 * @description 포트폴리오 최초 진입 시 채용 담당자의 회사명을 수집하는 모달 컴포넌트.
 * `companyName` 이 `null` 인 경우(= 최초 접근) 자동으로 모달이 열리며,
 * 외부 클릭 및 ESC 키로 닫히지 않아 반드시 입력을 완료해야 한다.
 * Zustand persist 의 하이드레이션 완료 후에만 렌더링하여 SSR/CSR 불일치를 방지한다.
 * 회사명 입력 시 Supabase `company` 테이블에 INSERT 하고 반환된 `company_id` 를 전역 상태에 저장한다.
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/shadcn/dialog';
import { useState } from 'react';
import { useCompanyActions, useCompanyName, useHasHydrated } from '../../../shared/model/store/company';
import { insertCompany } from '../api/insertCompany';

/**
 * 채용 담당자 회사명 입력 모달 컴포넌트.
 *
 * @description
 * - `companyName === null` 이면 모달이 자동으로 열린다.
 * - 회사명 입력 완료 시 `company` 테이블에 INSERT 후 `company_id` 를 전역 상태에 저장한다.
 * - '공개하고 싶지 않아요' 선택 시 `company_name: '비공개'` 로 DB INSERT 후 `company_id` 를 저장한다.
 * - 하이드레이션 전에는 `null` 을 반환하여 렌더링을 지연시킨다.
 */
export default function GetCompanyNameModal() {
  const companyName = useCompanyName();
  const { setCompanyName, setCompanyId } = useCompanyActions();
  const hasHydrated = useHasHydrated();
  const [isLoading, setIsLoading] = useState(false);

  // 하이드레이션이 완료된 후 렌더링하는 로직 추가
  if (!hasHydrated) return null;

  /**
   * 회사명을 `company` 테이블에 INSERT 하고 반환된 `company_id` 를 전역 상태에 저장하는 공통 핸들러.
   *
   * @param value - INSERT 할 회사명 문자열
   */
  const handleInsertCompany = async (value: string) => {
    setIsLoading(true);
    try {
      const companyId = await insertCompany({ company_name: value });
      setCompanyId(companyId);
      setCompanyName(value);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회사명 폼 제출 핸들러.
   * 입력값이 없거나 공백인 경우 실행하지 않는다.
   *
   * @param formData - 폼 데이터 (company-name 필드 포함)
   */
  const handleSubmitCompanyName = async (formData: FormData) => {
    const raw = formData.get('company-name') as string;
    if (!raw?.trim()) return;
    await handleInsertCompany(raw.trim());
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
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-gray-400 disabled:bg-gray-50"
            autoFocus
            required
            maxLength={30}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white rounded-lg px-4 py-2 text-sm cursor-pointer w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? '처리 중...' : '입력 완료'}
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-black/80 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleInsertCompany('비공개')}>
              공개하고 싶지 않아요
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
