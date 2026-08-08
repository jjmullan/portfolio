/**
 * @file Career.tsx
 * @description 성장 과정(이력) 페이지 컴포넌트.
 * 최신순으로 정렬된 경력, 개발, 자격증, 학력, 기타 항목을 타임라인 형태로 렌더링한다.
 * 데이터는 정적 상수(`CAREER_ITEMS`)로 관리하며, API 호출 없이 서버에서 렌더링된다.
 */

import Link from 'next/link';

type CareerCategory = '경력' | '프로젝트' | '자격' | '학력' | '경험' | '기타';

/**
 * 단일 이력 항목 타입.
 *
 * @property period - 활동 기간 문자열 (예: `'2025. 7 ~ 2025. 8'`)
 * @property title - 이력 항목 제목
 * @property category - 이력 카테고리 (`CareerCategory`)
 * @property descriptions - 항목 설명 문자열 배열
 * @property note - 부가 설명 텍스트 (선택)
 * @property link - 외부 링크 URL (선택, `'project'` 카테고리에서 활성화)
 */
type CareerItem = {
  category: CareerCategory;
  isAssociatedWithDev: boolean;
  period?: string;
  title?: string;
  descriptions?: string[];
  note?: string;
  link?: string;
};

// const CATEGORY_STYLE: Record<CareerCategory, string> = {
//   work: 'bg-blue-50 text-blue-600',
//   project: 'bg-emerald-50 text-emerald-600',
//   certificate: 'bg-amber-50 text-amber-600',
//   education: 'bg-violet-50 text-violet-600',
//   experience: 'bg-',
//   etc: 'bg-gray-100 text-gray-500',
// };

/** 최신순(최근 경험 → 마지막 경험) 내림차순으로 정렬된 이력 항목 배열 */
const CAREER_ITEMS: CareerItem[] = [
  {
    period: '2026. 6. ~ 2026. 8.',
    title: '상영시작후입장불가',
    category: '프로젝트',
    descriptions: ['전국 독립예술영화관의 통합된 상영 정보 및 큐레이션 정보를 제공하는 서비스'],
    link: 'https://nolateentry.com/',
    isAssociatedWithDev: true,
  },
  {
    period: '2026. 2. ~ 3.',
    title: 'AI 포트폴리오',
    category: '프로젝트',
    descriptions: ['사용자의 질문 의도를 기반으로 분산된 포트폴리오 정보를 통합 참조하여 응답하는 AI Native 포트폴리오'],
    link: 'https://youngjune.dev/',
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 11. ~ 2026. 2.',
    title: '포장맛차',
    category: '프로젝트',
    descriptions: ['사용자 리뷰를 중심으로 전국 포장마차 위치를 탐색하고 정보를 획득하고 생성하는 위치 기반 지도 서비스'],
    link: 'https://deliciousstreetfood.vercel.app/',
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 7 ~ 2025. 8',
    title: '오구텃밭',
    category: '프로젝트',
    descriptions: ['TypeScript + Next.js + MongoDB API 기반 상품 농산물 통합 상거래 플랫폼'],
    link: 'https://final-05-oguogu.vercel.app/',
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 5 ~ 2025. 5',
    title: '쿼카독스 (QuokkaDoccs)',
    category: '프로젝트',
    descriptions: ['JavaScript 기반 개발자 리소스 공유 플랫폼'],
    link: 'https://quokkadocs.netlify.app/',
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 8. ~ 현재',
    title: "개발 스터디 'DevTalk'",
    category: '경험',
    descriptions: [
      '프론트엔드 개발 스킬 및 발표 역량 강화 목적의 스터디 개설 및 운영',
      'TypeScript, Claude Code, Database 설계, FSD 아키텍처 등 총 7회 발표 진행',
    ],
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 2 ~ 2025. 8',
    title: '멋쟁이사자처럼 Frontend Bootcamp 13기',
    category: '경험',
    descriptions: [
      'HTML, CSS, JavaScript, TypeScript, React, Next.js 핵심 동작 원리와 개념을 이해',
      '팀 프로젝트 3회 진행: Kurly 클론 코딩, QuokkaDocs, 오구텃밭',
      '우수 수료생(3인) 선정',
    ],
    isAssociatedWithDev: true,
  },
  {
    period: '2026. 3.',
    title: '정보처리기사 (필기)',
    category: '자격',
    descriptions: ['운영체제, 데이터베이스, 자료구조, 소프트웨어 공학 등 CS 이론 학습', '비전공자로서 공학 지식 부족의 한계를 보완'],
    isAssociatedWithDev: true,
  },
  {
    period: '2025. 12.',
    title: 'SQLD',
    category: '자격',
    descriptions: ['데이터 모델링 및 쿼리 최적화 개념 학습', '데이터 구조 기반의 프론트엔드 설계 역량 강화'],
    isAssociatedWithDev: true,
  },
  {
    category: '기타',
    isAssociatedWithDev: true,
  },
  {
    period: '2023. 2. ~ 2024. 12.',
    title: 'KT&G 상상마당 시네마 (키노라이츠)',
    category: '경력',
    descriptions: [
      '인스타그램, X(트위터), 브런치, 네이버 스마트플레이스, 카카오 채널 관리 (팔로워 4k → 12k 상승)',
      '외부 커뮤니케이션 및 협업 콘텐츠 진행 (CJ 협업 팝업스토어 매출 100만원 달성)',
      '온/오프라인 콘텐츠 기획',
    ],
    isAssociatedWithDev: false,
  },
  {
    period: '2021. 12. ~ 2023. 2.',
    title: '아트나인',
    category: '경력',
    descriptions: [
      '관객 응대, 재고 관리, 시설 관리, 매출 관리',
      'GV, 시사회, 굿즈패키지 등 각종 영화 관련 행사 진행',
      '상영작 테스트 및 입출고 관리, 상영 서버 관리',
      "월간지 '페이퍼나인', '시네-잇(Cine-EAT)' 글 기고 및 오프라인 홍보 이미지 제작",
    ],
    isAssociatedWithDev: false,
  },
  {
    period: '2021. 4. ~ 2021. 7.',
    title: '제20회 미쟝센 단편영화제',
    category: '경력',
    descriptions: [
      '공식 홈페이지, 인스타그램, X(트위터), 페이스북, 네이버 TV 채널 관리',
      '온라인 홍보 콘텐츠 기획 및 제작, 영화제 공식 굿즈 디자인',
      'Paid 광고 집행 및 분석',
      '대행사 커뮤니케이션, 자원활동가 관리',
    ],
    isAssociatedWithDev: false,
  },
  {
    period: '2020. 10. ~ 2021. 3.',
    title: '서울브루어리',
    category: '경력',
    descriptions: ['인스타그램, 네이버 스마트플레이스 채널 관리', '온라인 홍보 콘텐츠 기획 및 제작'],
    isAssociatedWithDev: false,
  },
  {
    period: '2020. 5. ~ 2022. 10.',
    title: '유튜브 대한독립영화만세',
    category: '경험',
    descriptions: [
      '국내 독립예술영화를 소개하는 롱폼 채널 운영',
      '20여 개의 롱폼 콘텐츠로 총 조회 수 100만 회 돌파 및 구독자 수 6,000명 달성 (2026. 1 기준)',
    ],
    isAssociatedWithDev: false,
  },
  {
    period: '2024. 7.',
    title: '검색광고마케터 1급',
    category: '자격',
    descriptions: [
      '검색광고 전략 수립, 키워드 분석 및 확장, 광고 집행 및 운영 능력 향상',
      'KT&G 상상마당 시네마에서 Naver, Meta Paid 광고 집행 및 A/B 테스트를 통한 최적화 경험',
    ],
    isAssociatedWithDev: false,
  },
  {
    period: '2019. 8.',
    title: '컴퓨터활용능력 2급',
    category: '자격',
    descriptions: ['Excel 기반 데이터 처리 및 문서 관리 능력 향상'],
    isAssociatedWithDev: false,
  },
  {
    period: '2018. 10.',
    title: '그래픽기술자격(GTQ) 1급',
    category: '자격',
    descriptions: ['Adobe Photoshop 기반 이미지 편집 및 디자인 능력 향상'],
    isAssociatedWithDev: false,
  },
  {
    period: '2018. 2.',
    title: '전산회계 1급',
    category: '자격',
    descriptions: ['회계 기초 지식 확보'],
    isAssociatedWithDev: false,
  },
  {
    period: '2016. 9.',
    title: 'ITQ 엑셀/파워포인트 A급',
    category: '자격',
    descriptions: ['Excel, PowerPoint 를 활용한 데이터 관리 능력 향상'],
    isAssociatedWithDev: false,
  },
  {
    category: '기타',
    isAssociatedWithDev: true,
  },
  {
    period: '2012. 3. ~ 2020. 2.',
    title: '강남대학교',
    category: '학력',
    descriptions: ['경영학 전공, 사회사업학 부전공', '학점 3.63 / 4.5', '교내 서포터즈 활동 1회, 교내 개인 공모전 3회 수상'],
    isAssociatedWithDev: false,
  },
  {
    period: '2009. 3. ~ 2012. 2.',
    title: '명지고등학교',
    category: '학력',
    descriptions: ['인문'],
    isAssociatedWithDev: false,
  },
];

/**
 * 성장 과정(이력) 페이지 컴포넌트.
 *
 * @description
 * `CAREER_ITEMS` 배열을 타임라인 형태로 렌더링한다.
 * `'dev'` 카테고리이고 `link` 가 존재하는 항목은 제목에 외부 링크를 적용한다.
 */
export default function Career() {
  return (
    <div className="w-full max-w-layout px-10 py-12">
      <h2 className="sr-only">이력</h2>

      <ul className="relative">
        {CAREER_ITEMS.map(({ period, title, category, descriptions, note, link }, index) => {
          if (category === '기타') {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: 정적 데이터로 순서가 변경되지 않음
              <li key={index} className="mb-8 ml-6 border-b border-dashed border-gray-500" />
            );
          }

          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: 정적 데이터로 순서가 변경되지 않음
            <li key={index} className="mb-8 ml-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                {/* 기간 */}
                <time className="text-xs text-gray-400">{period}</time>
              </div>

              {/* 타이틀 */}
              <div className="flex items-center gap-x-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  <span className="font-normal">{category}&nbsp;—&nbsp;</span>
                  {link && category === '프로젝트' ? (
                    <Link href={link} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2 text-[#0000FF]">
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                </h3>
                {note && <span className="text-xs text-gray-400">{note}</span>}
              </div>

              {/* 설명 */}
              {descriptions && descriptions?.length > 0 && (
                <ul className="space-y-1">
                  {descriptions?.map((desc) => (
                    <li key={desc} className="flex gap-x-2 text-xs text-gray-500 leading-relaxed">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
