/**
 * @file onboarding.ts
 * @description 온보딩 UX 경험 여부를 전역으로 관리하는 Zustand 스토어.
 * `localStorage` 에 `hasOnboarded` 를 persist 하여 재방문 시 온보딩 UX 를 숨긴다.
 * 하이드레이션 완료 여부를 추적하여 SSR/CSR 불일치를 방지한다.
 */

import { create } from 'zustand';
import { combine, createJSONStorage, devtools, persist } from 'zustand/middleware';

/**
 * 온보딩 스토어의 상태(State) 타입.
 *
 * @property hasOnboarded - 온보딩 UX 를 경험한 적 있는지 여부. `localStorage` 에 persist 된다.
 * @property _hasHydrated - `localStorage` 에서 상태 복원(하이드레이션) 완료 여부
 */
type OnboardingStateType = {
  hasOnboarded: boolean;
  _hasHydrated: boolean;
};

/**
 * 온보딩 스토어의 액션(Action) 타입.
 *
 * @property setHasOnboarded - 온보딩 경험 여부를 설정한다.
 * @property setHasHydrated - 하이드레이션 완료 상태를 업데이트한다.
 */
type OnboardingActionType = {
  setHasOnboarded(value: boolean): void;
  setHasHydrated(value: boolean): void;
};

const initialState: OnboardingStateType = {
  hasOnboarded: false,
  _hasHydrated: false,
};

/**
 * 온보딩 전역 상태 스토어.
 *
 * @description
 * - `persist` 미들웨어로 `hasOnboarded` 를 `localStorage` 에 저장한다.
 * - `_hasHydrated` 는 persist 되지 않으며, `onRehydrateStorage` 콜백으로 복원 완료 시 `true` 로 설정한다.
 * - `devtools` 미들웨어로 Redux DevTools 에서 상태를 확인할 수 있다.
 */
export const useOnboardingStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setHasOnboarded: (value: boolean) => {
            set({ hasOnboarded: value });
          },
          setHasHydrated: (value: boolean) => {
            set({ _hasHydrated: value });
          },
        } as OnboardingActionType,
      })),
      {
        name: 'OnboardingStore',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          hasOnboarded: state.hasOnboarded,
        }),
        onRehydrateStorage: () => (state) => {
          state?.actions.setHasHydrated(true);
        },
      },
    ),
    { name: 'OnboardingStore' },
  ),
);

/** 온보딩 UX 경험 여부를 반환하는 셀렉터 훅 */
export const useHasOnboarded = () => useOnboardingStore((state) => state.hasOnboarded);

/** `localStorage` 하이드레이션 완료 여부를 반환하는 셀렉터 훅 */
export const useOnboardingHydrated = () => useOnboardingStore((state) => state._hasHydrated);

/** 온보딩 상태를 설정하는 액션 객체를 반환하는 셀렉터 훅 */
export const useOnboardingActions = () => useOnboardingStore((state) => state.actions);
