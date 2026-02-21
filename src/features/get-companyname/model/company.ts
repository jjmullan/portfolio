import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

type CompanyNameType = {
  companyName: string | null;
  _hasHydrated: boolean;
};

type CompanyNameActionType = {
  setCompanyName(companyName: string | null): void;
  setHasHydrated(value: boolean): void;
};

const initialState: CompanyNameType = {
  companyName: null,
  _hasHydrated: false,
};

export const useCompanyNameStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
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
        partialize: (state) => ({
          companyName: state.companyName,
        }),
      },
    ),
    { name: 'CompanyNameStore' },
  ),
);

export const useCompanyName = () => {
  const companyName = useCompanyNameStore((state) => state.companyName);
  return companyName;
};

export const useHasHydrated = () => {
  const hasHydrated = useCompanyNameStore((state) => state._hasHydrated);
  return hasHydrated;
};

export const useSetCompanyName = () => {
  const setCompanyName = useCompanyNameStore((state) => state.actions.setCompanyName);
  return setCompanyName;
};

export const useSetHydrated = () => {
  const setHydrated = useCompanyNameStore((state) => state.actions.setHasHydrated);
  return setHydrated;
};
