'use client';

import Image from 'next/image';
import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import { sendMessage } from '../../api/sendMessage';
import type { InProgressChatBoxType } from '../../model/types';
import { useChatActions, useChatMessages, useIsStreaming } from '../../model/useChatStore';

export default function InProgressChatBox({ onMessageSent }: InProgressChatBoxType) {
  const [input, setInput] = useState('');
  const messages = useChatMessages();
  const isStreaming = useIsStreaming();
  const { addUserMessage, startStreaming, appendStreamingContent, finalizeAssistantMessage } = useChatActions();

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
        onMessageSent(trimmed, fullResponse);
      },
      onError: () => {
        finalizeAssistantMessage();
      },
    });
  };

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
        disabled={isStreaming}
        placeholder="메시지를 입력하세요 (Enter 전송 / Shift+Enter 줄바꿈)"
        className="py-4 pl-4 pr-12 border border-gray-200 rounded-lg w-full text-sm placeholder:text-sm shadow-md resize-none disabled:bg-gray-50"
        rows={1}
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
