import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

type CompanyNameType = {
  companyName: string | null;
};

type CompanyNameActionType = {
  setCompanyName(companyName: string | null): void;
};

const initialState: CompanyNameType = {
  companyName: null,
};

export const useCompanyNameStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setCompanyName: (companyName: string) => {
            set({ companyName: companyName });
          },
        } as CompanyNameActionType,
      })),
      { name: 'CompanyNameStore' },
    ),
    { name: 'CompanyNameStore' },
  ),
);

export const useCompanyName = () => {
  const companyName = useCompanyNameStore((state) => state.companyName);
  return companyName;
};

export const useSetCompanyName = () => {
  const setCompanyName = useCompanyNameStore((state) => state.actions.setCompanyName);
  return setCompanyName;
};
