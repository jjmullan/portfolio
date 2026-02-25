'use client';

import { type ContextRecord, fetchContextsByGroupId, insertContext, useConversationHistoryActions } from '@entities/conversation';
import {
  ChatMessageList,
  type ChatMessageType,
  InProgressChatBox,
  sendMessage,
  useChatActions,
  useIsStreaming,
  usePendingContextGroup,
  usePendingInitialContext,
} from '@features/chat';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const searchParams = useSearchParams();
  // context 쿼리 파라미터에 context_group_id 가 담겨 있다
  const contextGroupId = searchParams?.get('context') ?? null;

  const pendingInitialContext = usePendingInitialContext();
  const pendingContextGroup = usePendingContextGroup();
  const isStreaming = useIsStreaming();
  const {
    addUserMessage,
    startStreaming,
    appendStreamingContent,
    setStreamingContent,
    finalizeAssistantMessage,
    setMessages,
    setPendingInitialContext,
    setPendingContextGroup,
  } = useChatActions();
  const { prependConversation } = useConversationHistoryActions();

  const isInitialized = useRef(false);

  // 최초 마운트 시 1회 실행: 스토어에 저장된 초기 질문으로 첫 번째 AI 응답 요청
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행하는 의도적인 빈 의존성 배열
  useEffect(() => {
    if (isInitialized.current || !pendingInitialContext) return;
    isInitialized.current = true;

    // 소비 후 즉시 초기화하여 재사용 방지
    const question = pendingInitialContext;
    const contextGroup = pendingContextGroup;
    // setPendingInitialContext('');
    setPendingContextGroup(null);

    // 이전 대화 내역이 스토어에 남아 있을 수 있으므로 초기화 후 신규 메시지 추가
    setMessages([]);
    addUserMessage(question);
    startStreaming();

    sendMessage({
      messages: [{ role: 'user', content: question }],
      onChunk: appendStreamingContent,
      onDone: (fullResponse) => {
        finalizeAssistantMessage();
        if (contextGroupId) {
          insertContext({
            context_group_id: contextGroupId,
            input_context: question,
            output_context: fullResponse,
          }).catch(console.error);
        }
        // 스트리밍 완료 시 사이드바 최근 대화 내역에 추가
        if (contextGroup) prependConversation(contextGroup);
      },
      onError: (error) => {
        setStreamingContent(error.message);
        finalizeAssistantMessage();
      },
    });
  }, []);

  // contextGroupId 변경 시 재실행: 사이드바에서 다른 대화 클릭 시 해당 context_group_id 의 메시지만 복원
  // 소유권 검증은 InProgressChatBox 에서 처리하며, 메시지는 소유 여부와 관계없이 표시한다
  // pendingInitialContext 가 있는 경우(신규 채팅)에는 실행하지 않는다
  // biome-ignore lint/correctness/useExhaustiveDependencies: pendingInitialContext, setMessages 는 contextGroupId 변경에 반응할 필요 없어 의도적으로 제외
  useEffect(() => {
    if (pendingInitialContext || !contextGroupId) return;

    // contextGroupId 전환 시 이전 대화 내역을 즉시 초기화
    setMessages([]);
    fetchContextsByGroupId(contextGroupId)
      .then((contexts: ContextRecord[]) => {
        const restoredMessages: ChatMessageType[] = contexts.flatMap(({ input_context, output_context }) => [
          { id: crypto.randomUUID(), role: 'user' as const, content: input_context },
          { id: crypto.randomUUID(), role: 'assistant' as const, content: output_context },
        ]);
        setMessages(restoredMessages);
      })
      .catch(console.error);
  }, [contextGroupId]);

  // 스트리밍 중: instant(즉시 이동), 완료 후: smooth(부드럽게 이동)
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? 'instant' : 'smooth' });
  });

  return (
    <div className="flex flex-col w-full max-w-layout px-10 py-8 min-h-screen">
      <div className="flex-1 pb-8">
        <ChatMessageList />
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 pb-4 w-full max-w-[640px] bg-white/80 backdrop-blur-sm">
        <InProgressChatBox contextGroupId={contextGroupId ?? null} />
      </div>
    </div>
  );
}
