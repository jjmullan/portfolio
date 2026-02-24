'use client';

import { fetchContextGroups, useConversationHistoryActions, useConversations } from '@features/chat';
import ListDownload from '@shared/ui/li/ListDownload';
import ListLink from '@shared/ui/li/ListLink';
import H2 from '@shared/ui/title/H2';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [toggleMenu, setToggleMenu] = useState(true);
  const conversations = useConversations();
  const { setConversations } = useConversationHistoryActions();

  // 마운트 시 1회 Supabase 에서 최근 대화 내역 로드
  useEffect(() => {
    fetchContextGroups().then(setConversations).catch(console.error);
  }, [setConversations]);
  const toggleMenuOnOff = () => {
    setToggleMenu((state) => !state);
  };

  return (
    <aside className={`p-3 flex flex-col gap-y-10 h-full overflow-y-auto ${toggleMenu ? 'w-[240px]' : 'w-[60px]'} overflow-hidden border-r`}>
      <button
        type="button"
        className="w-8 p-2 rounded-md cursor-pointer hover:bg-gray-100"
        onClick={toggleMenuOnOff}
        aria-expanded={toggleMenu}
        aria-controls="navigation-panel">
        <Image src={'/icons/menuonoff.svg'} alt={`메뉴 ${toggleMenu ? '닫기' : '열기'}`} width={16} height={16} />
      </button>
      <div className="flex flex-col gap-y-6">
        <nav>
          <H2 title="시작하기" isSrOnly={true} isHidden={!toggleMenu} />
          <ul className="flex flex-col">
            <ListLink href="/new" image="newpage" title="새로운 대화" isInnerLink={true} isHidden={!toggleMenu} />
            <ListLink href="/faq" image="qna" title="자주 묻는 질문" isInnerLink={true} isHidden={!toggleMenu} />
          </ul>
        </nav>
        <div hidden={!toggleMenu} className="flex flex-col gap-y-6">
          <div>
            <H2 title="관련 링크" isHidden={!toggleMenu} />
            <ul className="flex flex-col">
              <ListLink href="https://github.com/jjmullan?tab=repositories" image="github" title="Github" />
              <ListLink href="https://www.linkedin.com/in/jjmullan" image="linkedin" title="LinkedIn" />
              <ListLink href="https://jjmullan.slack.com/" image="slack" title="Slack" />
              <ListLink href="https://www.instagram.com/choiyoungjune/" image="instagram" title="Instagram" />
            </ul>
          </div>
          <div>
            <H2 title="파일 다운로드" isHidden={!toggleMenu} />
            <ul className="flex flex-col">
              <ListLink href="https://drive.google.com/drive/folders/1MG7HggVtEdWywLOnap-e5yxJZ3k0SAVa" image="googledrive" title="Google Drive" />
              <ListDownload href="/resume/resume.zip" image="pdf" title="PDF" />
            </ul>
          </div>
          <div>
            <H2 title="최근 대화 내역" isHidden={!toggleMenu} />
            <ul className="flex flex-col">
              {conversations.length === 0 ? (
                <li className="px-2 rounded-md flex items-center gap-x-2 w-full h-9 text-sm">대화를 시작해보세요😊</li>
              ) : (
                conversations.map(({ id, subject }) => (
                  <ListLink key={id} href={`/chat?context=${id}`} title={subject} image="" isInnerLink={true} isHidden={!toggleMenu} />
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
