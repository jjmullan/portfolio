import ListDownload from '@shared/ui/li/ListDownload';
import ListLink from '@shared/ui/li/ListLink';
import H2 from '@shared/ui/title/H2';

export default function Navigation() {
  return (
    <aside className="pt-7 pb-3 px-3 flex flex-col gap-y-6 h-full overflow-y-auto">
      <nav>
        <H2 title="시작하기" isSrOnly={true} />
        <ul className="flex flex-col">
          <ListLink href="/" image="newpage" title="새로운 대화" isInnerLink={true} />
          <ListLink href="/" image="qna" title="자주 묻는 질문" isInnerLink={true} />
        </ul>
      </nav>
      <nav>
        <H2 title="관련 링크" />
        <ul className="flex flex-col">
          <ListLink href="https://github.com/jjmullan?tab=repositories" image="github" title="Github" />
          <ListLink href="https://www.linkedin.com/in/jjmullan" image="linkedin" title="LinkedIn" />
          <ListLink href="https://jjmullan.slack.com/" image="slack" title="Slack" />
          <ListLink href="https://www.instagram.com/choiyoungjune/" image="instagram" title="Instagram" />
        </ul>
      </nav>
      <div>
        <H2 title="파일 다운로드" />
        <ul className="flex flex-col">
          <ListLink href="https://drive.google.com/drive/folders/1MG7HggVtEdWywLOnap-e5yxJZ3k0SAVa" image="googledrive" title="Google Drive" />
          <ListDownload href="/resume/resume.zip" image="pdf" title="PDF" />
        </ul>
      </div>
      <div>
        <H2 title="최근 대화내역" />
        <ul className="flex flex-col">
          {/* map 메서드로 업데이트 */}
          <ListLink href={``} image="" title="API 기반 포트폴리오 웹사이트" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
          <ListLink href={``} image="" title="Slack에 Github 연결 설치 오류" />
        </ul>
      </div>
    </aside>
  );
}
