'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/shadcn/dialog';
import { useCompanyName, useSetCompanyName } from '../model/company';

export default function GetCompanyNameModal() {
  const companyName = useCompanyName();
  const setCompanyName = useSetCompanyName();

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
            <button type="submit" className="bg-black text-white rounded-lg px-4 py-2 text-sm cursor-pointer w-full">
              등록하기
            </button>
            <button
              type="button"
              className="bg-gray-100 rounded-lg px-4 py-2 text-sm cursor-pointer w-full"
              onClick={() => setCompanyName('일반 사용자')}>
              채용 담당자가 아닙니다
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
