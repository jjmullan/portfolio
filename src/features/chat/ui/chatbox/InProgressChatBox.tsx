'use client';

/**
 * @file InProgressChatBox.tsx
 * @description 채팅 진행 중 사용되는 메시지 입력 컴포넌트.
 * 사용자 입력을 받아 Claude AI 에게 스트리밍 방식으로 메시지를 전송하고,
 * 응답 완료 후 `onMessageSent` 콜백을 호출하여 상위 컴포넌트에 결과를 전달한다.
 * 스트리밍 중에는 입력창과 전송 버튼이 비활성화된다.
 */

import { insertContext, validateContextOwnership } from '@entities/conversation';
import { useCompanyId } from '@shared/model/store/company';
import Image from 'next/image';
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';
import { sendMessage } from '../../api/sendMessage';
import { useChatActions, useChatMessages, useIsStreaming } from '../../model/chat';
import type { InProgressChatBoxType } from '../../model/types';

/**
 * 채팅 진행 중 메시지를 입력하고 전송하는 컴포넌트.
 *
 * @description
 * - Enter 키로 메시지를 전송하고, Shift+Enter 로 줄바꿈을 입력한다.
 * - 전송 시 `useChatStore` 액션을 통해 사용자 메시지를 추가하고 스트리밍을 시작한다.
 * - `sendMessage` API 를 통해 대화 히스토리를 포함한 메시지를 Claude AI 에 전달한다.
 * - 응답 완료 시 `insertContext` 를 직접 호출하여 `context` 테이블에 I/O 및 `context_group_id` 를 저장한다.
 *
 * @param props.contextGroupId - 현재 세션의 `context_group_id`. `context` 테이블 INSERT 시 외래 키로 사용된다.
 */
export default function InProgressChatBox({ contextGroupId }: InProgressChatBoxType) {
  const companyId = useCompanyId();
  const [input, setInput] = useState('');

  // 소유권 검증 전에 입력창이 잠깐 보이는 현상을 막기 위해 기본값을 false 로 설정
  const [isAuthorized, setIsAuthorized] = useState(false);
  const messages = useChatMessages();
  const isStreaming = useIsStreaming();
  const { addUserMessage, startStreaming, appendStreamingContent, setStreamingContent, finalizeAssistantMessage } = useChatActions();

  // contextGroupId 또는 companyId 변경 시 소유권 재검증
  useEffect(() => {
    if (!contextGroupId || !companyId) return;
    validateContextOwnership(contextGroupId, companyId)
      .then(setIsAuthorized)
      .catch(() => setIsAuthorized(false));
  }, [contextGroupId, companyId]);

  // 소유권 불일치 시 입력창 숨김
  if (!isAuthorized) return null;

  /**
   * 메시지 전송을 처리하는 핸들러.
   * 입력값이 비어있거나 스트리밍 중이면 실행하지 않는다.
   */
  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
    addUserMessage(trimmed);
    startStreaming();

    const history = messages.map(({ role, content }) => ({ role, content }));

    await sendMessage({
      messages: [...history, { role: 'user', content: trimmed }],
      onChunk: appendStreamingContent,
      onDone: (fullResponse) => {
        finalizeAssistantMessage();
        insertContext({
          // isAuthorized 가 true 인 시점에 contextGroupId 는 반드시 non-null
          context_group_id: contextGroupId!,
          input_context: trimmed,
          output_context: fullResponse,
        }).catch(console.error);
      },
      onError: (error) => {
        setStreamingContent(error.message);
        finalizeAssistantMessage();
      },
    });
  };

  /**
   * Enter 키 입력 시 메시지를 전송하는 키보드 이벤트 핸들러.
   * Shift+Enter 는 줄바꿈으로 처리한다.
   *
   * @param e - textarea 키보드 이벤트
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="w-full relative">
      <label htmlFor="chat-input" className="sr-only">
        메시지 입력
      </label>
      <textarea
        id="chat-input"
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={``}
        className="py-4 pl-4 pr-12 border border-gray-200 rounded-lg w-full text-sm placeholder:text-sm shadow-md resize-none disabled:bg-gray-50"
        rows={1}
        disabled={isStreaming}
        // disabled={true}
      />
      <button
        type="submit"
        disabled={isStreaming || !input.trim()}
        className="absolute bottom-3 right-2 rounded-lg p-3 cursor-pointer bg-white disabled:cursor-not-allowed disabled:opacity-40">
        <Image src="/icons/enter.svg" alt="전송" width={16} height={16} />
      </button>
    </form>
  );
}
