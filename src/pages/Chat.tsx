'use client';

import {
  ChatMessageList,
  InProgressChatBox,
  insertContext,
  sendMessage,
  useChatActions,
  useIsStreaming,
  usePendingInitialContext,
} from '@features/chat';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const searchParams = useSearchParams();
  // context 쿼리 파라미터에 context_group_id 가 담겨 있다
  const contextGroupId = searchParams?.get('context') ?? null;

  const pendingInitialContext = usePendingInitialContext();
  const isStreaming = useIsStreaming();
  const { addUserMessage, startStreaming, appendStreamingContent, finalizeAssistantMessage, setPendingInitialContext } = useChatActions();

  const isInitialized = useRef(false);

  // 최초 마운트 시 1회 실행: 스토어에 저장된 초기 질문으로 첫 번째 AI 응답 요청
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행하는 의도적인 빈 의존성 배열
  useEffect(() => {
    if (isInitialized.current || !pendingInitialContext) return;
    isInitialized.current = true;

    // 소비 후 즉시 초기화하여 재사용 방지
    const question = pendingInitialContext;
    setPendingInitialContext('');

    addUserMessage(question);
    startStreaming();

    sendMessage({
      messages: [{ role: 'user', content: question }],
      onChunk: appendStreamingContent,
      onDone: (fullResponse) => {
        finalizeAssistantMessage();
        insertContext({
          context_group_id: contextGroupId,
          input_context: question,
          output_context: fullResponse,
        }).catch(console.error);
      },
      onError: () => {
        finalizeAssistantMessage();
      },
    });
  }, []);

  // 스트리밍 중: instant(즉시 이동), 완료 후: smooth(부드럽게 이동)
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? 'instant' : 'smooth' });
  });

  return (
    <div className="flex flex-col w-full max-w-[640px] px-10 py-8 min-h-screen">
      <div className="flex-1 pb-28">
        <ChatMessageList />
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 pb-4 w-full max-w-[640px] bg-white/80 backdrop-blur-sm">
        <InProgressChatBox contextGroupId={contextGroupId ?? null} />
      </div>
    </div>
  );
}
