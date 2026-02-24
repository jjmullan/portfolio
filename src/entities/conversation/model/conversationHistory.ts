/**
 * @file useConversationHistoryStore.ts
 * @description 사이드바 '최근 대화 내역' 목록을 관리하는 Zustand 스토어.
 * 마운트 시 Supabase 에서 초기 데이터를 로드하고, 스트리밍 완료 시 새 항목이 맨 앞에 추가된다.
 */

import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import type { ConversationItem } from './types';

/**
 * 대화 내역 스토어의 상태(State) 타입.
 *
 * @property conversations - 최근 대화 내역 배열 (최신순)
 */
type ConversationHistoryStateType = {
  conversations: ConversationItem[];
};

/**
 * 대화 내역 스토어의 액션(Action) 타입.
 *
 * @property prependConversation - 새 대화 항목을 목록 맨 앞에 추가
 * @property setConversations - Supabase 초기 로드 데이터로 목록 전체를 교체
 */
type ConversationHistoryActionType = {
  prependConversation(item: ConversationItem): void;
  setConversations(items: ConversationItem[]): void;
};

const initialState: ConversationHistoryStateType = {
  conversations: [],
};

/**
 * 최근 대화 내역 전역 상태 스토어.
 *
 * @description
 * `Navigation` 위젯이 마운트 시 `setConversations` 로 초기 데이터를 채우고,
 * `Chat` 페이지에서 스트리밍이 완료되면 `prependConversation` 으로 새 항목을 추가한다.
 */
export const useConversationHistoryStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        prependConversation: (item: ConversationItem) => {
          set((state) => ({ conversations: [item, ...state.conversations] }));
        },
        setConversations: (items: ConversationItem[]) => {
          set({ conversations: items });
        },
      } as ConversationHistoryActionType,
    })),
    { name: 'ConversationHistoryStore' },
  ),
);

/** 최근 대화 내역 배열을 구독하는 셀렉터 훅 */
export const useConversations = () => useConversationHistoryStore((state) => state.conversations);

/** 대화 내역 스토어의 액션 객체를 반환하는 셀렉터 훅 */
export const useConversationHistoryActions = () => useConversationHistoryStore((state) => state.actions);
