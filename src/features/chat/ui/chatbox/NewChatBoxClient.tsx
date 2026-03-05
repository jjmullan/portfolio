'use client';

/**
 * @file NewChatBoxClient.tsx
 * @description 새 채팅을 시작하는 메시지 입력 클라이언트 컴포넌트.
 * 서버 컴포넌트(`NewChatBox`)에서 생성한 `placeholder` 를 prop 으로 전달받아 사용한다.
 * Hydration 오류 방지를 위해 랜덤 값 생성 로직을 서버 컴포넌트로 분리하였다.
 */

import { insertContextGroup } from '@entities/conversation';
import { useCompanyId, useCompanyName } from '@shared/model/store/company';
import { useHasOnboarded, useOnboardingActions, useOnboardingHydrated } from '@shared/model/store/onboarding';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Activity, type ChangeEvent, type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';
import { summarizeContext } from '../../api/summarizeContext';
import { useChatActions } from '../../model/chat';

export default function NewChatBoxClient({ placeholder }: { placeholder: string }) {
  const companyName = useCompanyName();
  const companyId = useCompanyId();

  const hasOnboarded = useHasOnboarded();
  const onboardingHydrated = useOnboardingHydrated();
  const { setHasOnboarded } = useOnboardingActions();

  // GetCompanyNameModal 이 닫힌 이후 시점에만 온보딩 UX 를 표시한다.
  // companyName 이 undefined 이면 모달이 열린 상태이므로 숨긴다.
  const showOnboarding = onboardingHydrated && !hasOnboarded && companyName !== undefined;

  // Context 입력창 변경 기능
  const [context, setContext] = useState<string>('');
  const handleChangeContext = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.currentTarget.value);
    // 최초 입력 시 온보딩 UX 를 숨긴다.
    if (!hasOnboarded) setHasOnboarded(true);
  };

  // Context 입력창 Focus 기능
  const contextRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (companyName !== null) contextRef.current?.focus();
  }, [companyName]);

  // Context 입력창 높이 자동 조절 (최대 10줄)
  useLayoutEffect(() => {
    const el = contextRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const paddingY = parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom);
    const maxHeight = lineHeight * 10 + paddingY;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [context]);

  // 페이지 이동 로직
  // input_context 는 URL 쿼리 파라미터로 /chat 에 전달하고,
  // Supabase INSERT 는 /chat 에서 응답 완료 후 input + output 을 함께 처리한다.
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setPendingInitialContext, setPendingContextGroup } = useChatActions();

  /**
   * 폼 제출 핸들러.
   * 입력값을 AI 로 한 줄 요약하여 `subject` 를 생성하고,
   * `context_group` 테이블에 새 레코드를 생성한 뒤,
   * 반환된 `context_group_id` 를 `context` 쿼리 파라미터로 `/chat` 에 전달한다.
   * 입력값이 없으면 실행하지 않는다.
   *
   * @param formData - 폼 데이터 (context 필드 포함)
   */
  const handleRequestContext = async (formData: FormData) => {
    const value = formData.get('context') as string;
    if (!value) return;

    setIsLoading(true);
    try {
      setPendingInitialContext(value);
      const subject = await summarizeContext(value);
      const contextGroupId = await insertContextGroup({ company_id: companyId!, subject });
      setPendingContextGroup({ id: contextGroupId, subject });
      router.push(`/chat?context=${contextGroupId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

      const formData = new FormData();
      formData.append('context', context);
      handleRequestContext(formData);
    }
  };

  return (
    <div className={showOnboarding ? 'relative w-full' : 'w-full'}>
      <form action={handleRequestContext} className="w-full relative">
        <label htmlFor="context" className="sr-only">
          AI 검색어 입력
        </label>
        <textarea
          id="context"
          name="context"
          ref={contextRef}
          value={context}
          onChange={handleChangeContext}
          className="py-4 pl-4 pr-12 border border-gray-200 rounded-lg w-full text-sm placeholder:text-sm shadow-md resize-none disabled:bg-gray-50"
          placeholder={placeholder}
          aria-label={context ? `${context} 검색` : '검색'}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          rows={1}
          disabled={isLoading}
        />
        <button type="submit" className="absolute bottom-3 right-2 rounded-lg p-3 cursor-pointer disabled:cursor-not-allowed" disabled={isLoading}>
          <Image src={'/icons/enter.svg'} alt={''} width={16} height={16} />
        </button>
      </form>
      {/* 온보딩 UI 제공 */}
      <Activity mode={showOnboarding ? 'visible' : 'hidden'}>
        <svg
          className="absolute pointer-events-none animate-in fade-in-0 duration-500"
          style={{ left: '-12px', top: '-12px', width: 'calc(100% + 24px)', height: 'calc(100% + 24px)' }}
          aria-hidden="true">
          <defs>
            <linearGradient id="onboarding-shine" x1="-1" y1="0" x2="0" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="40%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#d1d5db" />
              <animate attributeName="x1" from="-1" to="1" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="x2" from="0" to="2" dur="2.5s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
            rx="10"
            fill="none"
            stroke="url(#onboarding-shine)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
        </svg>
        <p className="absolute top-full left-0 right-0 mt-5 text-xs text-gray-400 text-center animate-in fade-in-0 duration-500">
          궁금한 점을 입력해주시면 AI가 저의 프로젝트, 경험, 역량 등을 분석해 답변해드립니다!
        </p>
      </Activity>
    </div>
  );
}
