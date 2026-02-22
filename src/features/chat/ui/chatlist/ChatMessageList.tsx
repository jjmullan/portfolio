'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatMessages, useIsStreaming, useStreamingContent } from '../../model/useChatStore';

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-black text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">{content}</div>
    </div>
  );
}

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
