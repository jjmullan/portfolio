'use client';

import { ChatMessageList, InProgressChatBox, insertContext, sendMessage, useChatActions, usePendingInitialContext } from '@features/chat';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const pendingInitialContext = usePendingInitialContext();
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
          input_context: question,
          output_context: fullResponse,
        }).catch(console.error);
      },
      onError: () => {
        finalizeAssistantMessage();
      },
    });
  }, []);

  // 메시지 추가 시 자동 스크롤
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <div className="flex flex-col w-full max-w-[640px] px-10 py-8 min-h-screen">
      <div className="flex-1 pb-28">
        <ChatMessageList />
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 pb-4 w-full max-w-[640px] bg-white/80 backdrop-blur-sm">
        <InProgressChatBox />
      </div>
    </div>
  );
}
