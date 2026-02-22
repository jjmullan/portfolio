'use client';

import { ChatMessageList, InProgressChatBox, insertContext, sendMessage, useChatActions } from '@features/chat';
import { useCompanyName } from '@shared/model/store/company';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const searchParams = useSearchParams();
  const initialContext = searchParams?.get('context') ?? '';
  const companyName = useCompanyName();
  const { addUserMessage, startStreaming, appendStreamingContent, finalizeAssistantMessage } = useChatActions();

  const isInitialized = useRef(false);

  // 최초 마운트 시 1회 실행: 초기 질문으로 첫 번째 AI 응답 요청
  useEffect(() => {
    if (isInitialized.current || !initialContext) return;
    isInitialized.current = true;

    addUserMessage(initialContext);
    startStreaming();

    sendMessage({
      messages: [{ role: 'user', content: initialContext }],
      onChunk: appendStreamingContent,
      onDone: (fullResponse) => {
        finalizeAssistantMessage();
        insertContext({
          company_name: companyName,
          input_context: initialContext,
          output_context: fullResponse,
        }).catch(console.error);
      },
      onError: () => {
        finalizeAssistantMessage();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 메시지 추가 시 자동 스크롤
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleMessageSent = (inputContext: string, outputContext: string) => {
    insertContext({
      company_name: companyName,
      input_context: inputContext,
      output_context: outputContext,
    }).catch(console.error);
  };

  return (
    <div className="flex flex-col w-full max-w-[640px] px-10 py-8 min-h-screen">
      <div className="flex-1 pb-28">
        <ChatMessageList />
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 pb-4 w-full max-w-[640px] bg-white/80 backdrop-blur-sm">
        <InProgressChatBox onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
}
