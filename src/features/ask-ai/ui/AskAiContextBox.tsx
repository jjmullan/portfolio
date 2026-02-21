'use client';

import { useCompanyName } from '@entities/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import { insertContext } from '../api/insertContext';

export default function AskAiContextBox() {
  const companyName = useCompanyName();

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmitContext = async (formData: FormData) => {
    if (!formData.get('context')) return;

    setIsLoading(true);
    const value = formData.get('context') as string;
    try {
      await insertContext({ company: companyName, context: value });
      router.push(`/chat?context=${encodeURIComponent(value)}`);
    } catch (error) {
      console.error('검색 과정에서 오류 발생', error);
    } finally {
      setIsLoading(false);
    }
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
        disabled={isLoading}
        tabIndex={0}
      />
      <button
        type="submit"
        className="absolute bottom-3 right-3 rounded-lg p-2 cursor-pointer bg-white disabled:cursor-not-allowed"
        disabled={isLoading}>
        <Image src={'/icons/enter.svg'} alt={''} width={16} height={16} />
      </button>
    </form>
  );
}
