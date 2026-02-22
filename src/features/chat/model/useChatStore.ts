import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

export type ChatMessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatStateType = {
  messages: ChatMessageType[];
  isStreaming: boolean;
  streamingContent: string;
};

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

export const useChatMessages = () => useChatStore((state) => state.messages);
export const useIsStreaming = () => useChatStore((state) => state.isStreaming);
export const useStreamingContent = () => useChatStore((state) => state.streamingContent);
export const useChatActions = () => useChatStore((state) => state.actions);
