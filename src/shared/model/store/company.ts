/**
 * @file company.ts
 * @description 채용 담당자의 회사 정보를 전역으로 관리하는 Zustand 스토어.
 * `sessionStorage` 에 `companyName` 과 `company_id` 를 persist 하여 세션 내 상태를 유지하고,
 * 하이드레이션 완료 여부를 추적하여 SSR/CSR 불일치를 방지한다.
 */

import { create } from 'zustand';
import { combine, createJSONStorage, devtools, persist } from 'zustand/middleware';

/**
 * 회사 스토어의 상태(State) 타입.
 *
 * @property company_id - Supabase `company` 테이블의 PK. `null` 이면 미삽입 상태 ('비공개' 포함).
 * @property companyName - 채용 담당자가 입력한 회사명. `null` 이면 최초 접근으로 판단한다.
 * @property _hasHydrated - sessionStorage 에서 상태 복원(하이드레이션) 완료 여부
 */
type CompanyNameType = {
  company_id: string | null;
  companyName: string | null;
  _hasHydrated: boolean;
};

/**
 * 회사 스토어의 액션(Action) 타입.
 *
 * @property setCompanyId - Supabase insert 후 반환된 `company_id` 를 저장한다.
 * @property setCompanyName - 회사명을 설정한다. `'비공개'` 로 설정 시 다운로드 기능이 비활성화된다.
 * @property setHasHydrated - 하이드레이션 완료 상태를 업데이트한다.
 */
type CompanyNameActionType = {
  setCompanyId(companyId: string | null): void;
  setCompanyName(companyName: string | null): void;
  setHasHydrated(value: boolean): void;
};

const initialState: CompanyNameType = {
  company_id: null,
  companyName: null,
  _hasHydrated: false,
};

/**
 * 회사 전역 상태 스토어.
 *
 * @description
 * - `persist` 미들웨어로 `company_id` 와 `companyName` 을 `sessionStorage` 에 저장한다.
 * - `_hasHydrated` 는 persist 되지 않으며, `onRehydrateStorage` 콜백으로 복원 완료 시 `true` 로 설정한다.
 * - `devtools` 미들웨어로 Redux DevTools 에서 상태를 확인할 수 있다.
 */
export const useCompanyNameStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setCompanyId: (companyId: string | null) => {
            set({ company_id: companyId });
          },
          setCompanyName: (companyName: string) => {
            set({ companyName: companyName });
          },
          setHasHydrated: (value: boolean) => {
            set({ _hasHydrated: value });
          },
        } as CompanyNameActionType,
      })),
      {
        name: 'CompanyNameStore',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          // company_id: state.company_id,
          companyName: state.companyName,
        }),
        onRehydrateStorage: () => (state) => {
          state?.actions.setHasHydrated(true);
        },
      },
    ),
    { name: 'CompanyNameStore' },
  ),
);

/** sessionStorage 에서 복원된 `company_id` 를 반환하는 셀렉터 훅 */
export const useCompanyId = () => useCompanyNameStore((state) => state.company_id);

/** sessionStorage 에서 복원된 회사명을 반환하는 셀렉터 훅 */
export const useCompanyName = () => useCompanyNameStore((state) => state.companyName);

/** sessionStorage 하이드레이션 완료 여부를 반환하는 셀렉터 훅 */
export const useHasHydrated = () => useCompanyNameStore((state) => state._hasHydrated);

/** 회사 정보를 설정하는 액션 객체를 반환하는 셀렉터 훅 */
export const useCompanyActions = () => useCompanyNameStore((state) => state.actions);

/** 회사명을 설정하는 액션 함수를 반환하는 셀렉터 훅 */
export const useSetCompanyName = () => useCompanyNameStore((state) => state.actions.setCompanyName);

/** 하이드레이션 상태를 설정하는 액션 함수를 반환하는 셀렉터 훅 */
export const useSetHydrated = () => useCompanyNameStore((state) => state.actions.setHasHydrated);
