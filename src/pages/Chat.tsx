"use client";

/**
 * @file Chat.tsx
 * @description AI 채팅 페이지 컴포넌트.
 * 최초 진입 시 스토어에 저장된 첫 질문으로 스트리밍을 시작하고,
 * 사이드바에서 기존 대화를 선택하면 해당 `context_group_id` 의 메시지를 복원한다.
 * `useSearchParams` 사용으로 `Suspense` 경계 내에서 렌더링해야 한다.
 */

import {
  fetchContextsByGroupId,
  insertContext,
  useConversationHistoryActions,
} from "@entities/conversation";
import {
  ChatMessageList,
  type ChatMessageType,
  InProgressChatBox,
  sendMessage,
  useChatActions,
  useIsStreaming,
  usePendingContextGroup,
  usePendingInitialContext,
} from "@features/chat";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Chat() {
  const searchParams = useSearchParams();
  // context 쿼리 파라미터에 context_group_id 가 담겨 있다
  const contextGroupId = searchParams?.get("context") ?? null;

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

  const initialRequestContextGroupId = useRef<string | null>(null);

  // 최초 마운트 시 1회 실행: 신규 채팅에서 생성한 첫 질문으로만 첫 번째 AI 응답 요청
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행하는 의도적인 빈 의존성 배열
  useEffect(() => {
    if (
      isInitialized.current ||
      !pendingInitialContext ||
      !pendingContextGroup ||
      pendingContextGroup.id !== contextGroupId
    )
      return;
    isInitialized.current = true;
    initialRequestContextGroupId.current = contextGroupId;

    // 소비 후 즉시 초기화하여 재사용 방지
    const question = pendingInitialContext;
    const contextGroup = pendingContextGroup;
    setPendingInitialContext("");
    setPendingContextGroup(null);

    // 이전 대화 내역이 스토어에 남아 있을 수 있으므로 초기화 후 신규 메시지 추가
    setMessages([]);
    addUserMessage(question);
    startStreaming();

    sendMessage({
      messages: [{ role: "user", content: question }],
      onChunk: appendStreamingContent,
      onDone: async (fullResponse) => {
        finalizeAssistantMessage();
        if (contextGroupId) {
          try {
            await insertContext({
              context_group_id: contextGroupId,
              input_context: question,
              output_context: fullResponse,
            });
          } catch (error) {
            console.error(error);
          }
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

  // contextGroupId 변경 시 재실행: 저장된 Supabase output 원본만 복원한다.
  // 신규 채팅으로 소비한 contextGroupId 는 스트리밍/저장 완료 전 빈 조회로 덮이지 않도록 제외한다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: setMessages 는 contextGroupId 변경에만 반응하면 된다
  useEffect(() => {
    if (
      !contextGroupId ||
      initialRequestContextGroupId.current === contextGroupId
    )
      return;

    // contextGroupId 전환 시 이전 대화 내역을 즉시 초기화
    setMessages([]);

    let ignore = false;

    const restore = async () => {
      try {
        const contexts = await fetchContextsByGroupId(contextGroupId);
        const restoredMessages: ChatMessageType[] = contexts.flatMap(
          ({ input_context, output_context }) => [
            {
              id: crypto.randomUUID(),
              role: "user" as const,
              content: input_context,
            },
            {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              content: output_context,
            },
          ],
        );
        if (ignore) return;
        setMessages(restoredMessages);
      } catch (error) {
        if (ignore) return;
        console.error(error);
      }
    };
    restore();

    return () => {
      ignore = true;
    };
  }, [contextGroupId]);

  // 스트리밍 중: instant(즉시 이동), 완료 후: smooth(부드럽게 이동)
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isStreaming ? "instant" : "smooth",
    });
  });

  return (
    <div className="flex flex-col w-full max-w-layout px-10 py-8 min-h-screen">
      <div className="flex-1 pb-24">
        <ChatMessageList />
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 pb-4 w-full max-w-[640px] bg-white/80 backdrop-blur-sm">
        <InProgressChatBox contextGroupId={contextGroupId ?? null} />
      </div>
    </div>
  );
}
