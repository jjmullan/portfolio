'use client';

/**
 * @file ChatMessageList.tsx
 * @description 대화 메시지 목록을 렌더링하는 컴포넌트 모음.
 * `useChatStore` 에서 메시지 상태를 구독하여 사용자/어시스턴트 메시지를 순서대로 표시한다.
 * 어시스턴트 메시지는 `react-markdown` + `remark-gfm` 으로 Markdown 형식으로 렌더링되며,
 * 스트리밍 중에는 커서 애니메이션(`animate-pulse`)이 표시된다.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatMessages, useIsStreaming, useStreamingContent } from '../../model/chat';

/**
 * 사용자가 보낸 메시지를 오른쪽 정렬로 표시하는 컴포넌트.
 *
 * @param props.content - 표시할 메시지 텍스트 (공백 보존을 위해 `whitespace-pre-wrap` 적용)
 */
function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-black text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">{content}</div>
    </div>
  );
}

/**
 * AI 어시스턴트의 응답을 왼쪽 정렬로 표시하는 컴포넌트.
 * Markdown 을 GFM(GitHub Flavored Markdown) 형식으로 파싱하여 렌더링한다.
 *
 * @param props.content - 표시할 Markdown 텍스트
 * @param props.isStreaming - 스트리밍 진행 중 여부. `true` 이면 커서 애니메이션을 표시한다 (기본값: `false`)
 */
function AssistantMessage({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-1 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-sm font-bold mt-3 mb-1 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0">{children}</h3>,
            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-400 pl-3 italic text-gray-600 my-2">{children}</blockquote>,
            code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="w-full border-collapse text-xs">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-200">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-b border-gray-300 last:border-0">{children}</tr>,
            th: ({ children }) => <th className="px-3 py-1.5 text-left font-semibold">{children}</th>,
            td: ({ children }) => <td className="px-3 py-1.5">{children}</td>,
          }}>
          {content}
        </ReactMarkdown>
        {isStreaming && <span className="inline-block w-1 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />}
      </div>
    </div>
  );
}

/**
 * 전체 대화 메시지 목록을 렌더링하는 최상위 컴포넌트.
 *
 * @description
 * `useChatStore` 에서 완료된 메시지 배열, 스트리밍 상태, 스트리밍 콘텐츠를 구독한다.
 * 완료된 메시지는 `role` 에 따라 `UserMessage` 또는 `AssistantMessage` 로 렌더링되며,
 * 스트리밍 중인 경우 목록 하단에 실시간 응답을 별도로 렌더링한다.
 */
export default function ChatMessageList() {
  const messages = useChatMessages();
  const isStreaming = useIsStreaming();
  const streamingContent = useStreamingContent();

  return (
    <div className="flex flex-col gap-y-4 w-full">
      {messages.map((msg) =>
        msg.role === 'user' ? <UserMessage key={msg.id} content={msg.content} /> : <AssistantMessage key={msg.id} content={msg.content} />,
      )}
      {isStreaming && <AssistantMessage content={streamingContent} isStreaming={true} />}
    </div>
  );
}
