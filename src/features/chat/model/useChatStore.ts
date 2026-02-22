/**
 * @file useChatStore.ts
 * @description AI 채팅 상태를 관리하는 Zustand 스토어.
 * 대화 히스토리, 스트리밍 상태, 스트리밍 중인 콘텐츠를 전역으로 관리한다.
 * devtools 미들웨어를 통해 브라우저 Redux DevTools 에서 상태를 확인할 수 있다.
 */

import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

/**
 * 채팅 메시지 단일 항목의 타입.
 *
 * @property id - `crypto.randomUUID()` 로 생성된 고유 식별자
 * @property role - 메시지 발신자 구분 (`'user'` | `'assistant'`)
 * @property content - 메시지 본문 텍스트
 */
export type ChatMessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/**
 * 채팅 스토어의 상태(State) 타입.
 *
 * @property messages - 스트리밍 완료된 전체 대화 메시지 배열
 * @property isStreaming - AI 응답이 스트리밍 중인지 여부
 * @property streamingContent - 현재 스트리밍 중인 누적 텍스트 (완료 시 `messages` 로 이동)
 */
type ChatStateType = {
  messages: ChatMessageType[];
  isStreaming: boolean;
  streamingContent: string;
};

/**
 * 채팅 스토어의 액션(Action) 타입.
 *
 * @property addUserMessage - 사용자 메시지를 `messages` 배열에 추가
 * @property startStreaming - 스트리밍 시작 상태로 전환하고 `streamingContent` 를 초기화
 * @property appendStreamingContent - 수신된 청크를 `streamingContent` 에 누적
 * @property finalizeAssistantMessage - 스트리밍 완료 후 `streamingContent` 를 assistant 메시지로 확정하고 초기화
 * @property reset - 스토어를 초기 상태로 되돌림
 */
type ChatActionType = {
  addUserMessage(content: string): void;
  startStreaming(): void;
  appendStreamingContent(chunk: string): void;
  finalizeAssistantMessage(): void;
  reset(): void;
};

const initialState: ChatStateType = {
  messages: [],
  isStreaming: false,
  streamingContent: '',
};

/**
 * 채팅 전역 상태 스토어.
 *
 * @description
 * `combine` 으로 상태와 액션을 분리하고, `devtools` 로 Redux DevTools 연동을 제공한다.
 * 액션은 `state.actions` 로 접근하며, 각 셀렉터 훅을 통해 필요한 상태만 구독한다.
 */
export const useChatStore = create(
  devtools(
    combine(initialState, (set, get) => ({
      actions: {
        addUserMessage: (content: string) => {
          set((state) => ({
            messages: [...state.messages, { id: crypto.randomUUID(), role: 'user', content }],
          }));
        },
        startStreaming: () => {
          set({ isStreaming: true, streamingContent: '' });
        },
        appendStreamingContent: (chunk: string) => {
          set((state) => ({ streamingContent: state.streamingContent + chunk }));
        },
        finalizeAssistantMessage: () => {
          const { streamingContent } = get();
          set((state) => ({
            messages: [...state.messages, { id: crypto.randomUUID(), role: 'assistant', content: streamingContent }],
            isStreaming: false,
            streamingContent: '',
          }));
        },
        reset: () => {
          set(initialState);
        },
      } as ChatActionType,
    })),
    { name: 'ChatStore' },
  ),
);

/** 완료된 전체 메시지 배열을 구독하는 셀렉터 훅 */
export const useChatMessages = () => useChatStore((state) => state.messages);

/** AI 응답 스트리밍 진행 여부를 구독하는 셀렉터 훅 */
export const useIsStreaming = () => useChatStore((state) => state.isStreaming);

/** 현재 스트리밍 중인 누적 텍스트를 구독하는 셀렉터 훅 */
export const useStreamingContent = () => useChatStore((state) => state.streamingContent);

/** 채팅 스토어의 액션 객체를 반환하는 셀렉터 훅 */
export const useChatActions = () => useChatStore((state) => state.actions);
