'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useLayoutEffect, useRef, useState } from 'react';

export default function AskAiContextBox() {
  // Context 입력창 변경 기능
  const [context, setContext] = useState<string>('');
  const handleChangeContext = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.currentTarget.value);
  };

  // Context 입력창 Focus 기능
  const contextRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    contextRef.current?.focus();
  }, []);

  // 페이지 이동 로직
  const router = useRouter();
  const handleSubmitContext = (formData: FormData) => {
    const value = (formData.get('context') as string) ?? '';
    router.push(`/chat?context=${encodeURIComponent(value)}`);
  };

  return (
    <form action={handleSubmitContext} className="w-full relative">
      <label htmlFor="context" className="sr-only">
        AI 검색어 입력
      </label>
      <textarea
        id="context"
        name="context"
        ref={contextRef}
        value={context}
        onChange={handleChangeContext}
        className="py-4 pl-4 pr-8 border border-gray-200 rounded-lg w-full text-sm placeholder:text-sm shadow-md"
        placeholder="무엇이든 물어보세요"
        aria-label={context ? `${context} 검색` : '검색'}
      />
      <button type="submit" className="absolute bottom-3 right-3 rounded-lg p-2 cursor-pointer bg-white">
        <Image src={'/icons/enter.svg'} alt={''} width={16} height={16} />
      </button>
    </form>
  );
}
