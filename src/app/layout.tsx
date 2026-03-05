import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GetCompanyNameModal } from '@entities/company';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import Navigation from '@widgets/navigation/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: '최영준의 포트폴리오',
    template: '%s | 최영준',
  },
  description: '프론트엔드 개발자 최영준의 포트폴리오입니다.',
  keywords: [
    '프론트엔드 포트폴리오',
    '개발자 포트폴리오',
    '프론트엔드 개발자 포트폴리오',
    '프론트엔드',
    '포트폴리오',
    '최영준',
    'Next.js',
    'React',
    'TypeScript',
  ],
  authors: [{ name: '최영준', url: 'https://github.com/jjmullan' }],
  creator: '최영준',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://youngjune.dev/',
  },
  openGraph: {
    title: '최영준의 포트폴리오',
    description: '프론트엔드 개발자 최영준의 포트폴리오입니다.',
    url: 'https://youngjune.dev/',
    siteName: '최영준의 포트폴리오',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '최영준의 포트폴리오',
    description: '프론트엔드 개발자 최영준의 포트폴리오입니다.',
    creator: '@jjmullan',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://youngjune.dev/#person',
      name: '최영준',
      alternateName: 'June',
      url: 'https://youngjune.dev/',
      jobTitle: 'Frontend Developer',
      description: 'React, Next.js, TypeScript 기반으로 제품 중심 UI를 만드는 프론트엔드 개발자 최영준입니다.',
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
      nationality: { '@type': 'Country', name: 'South Korea' },
      sameAs: ['https://github.com/jjmullan', 'https://www.linkedin.com/in/jjmullan'],
      // "image": "https://youngjune.dev/og/profile.jpg" (있으면 강추)
    },
    {
      '@type': 'WebSite',
      '@id': 'https://youngjune.dev/#website',
      name: '최영준의 포트폴리오',
      url: 'https://youngjune.dev/',
      description: '프론트엔드 개발자 최영준의 포트폴리오 사이트입니다.',
      inLanguage: 'ko-KR',
      publisher: { '@id': 'https://youngjune.dev/#person' },
    },
    {
      '@type': ['WebPage', 'ProfilePage'],
      '@id': 'https://youngjune.dev/#home',
      name: '최영준 | Frontend Developer Portfolio',
      url: 'https://youngjune.dev/',
      description: '프로젝트, 기술 스택, 문제 해결 경험을 소개하는 프론트엔드 개발자 최영준의 포트폴리오 홈입니다.',
      inLanguage: 'ko-KR',
      isPartOf: { '@id': 'https://youngjune.dev/#website' },
      about: { '@id': 'https://youngjune.dev/#person' },
      mainEntity: { '@id': 'https://youngjune.dev/#person' },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <Analytics />

        {/* 1024px 이하: 웹 전용 안내 */}
        <div className="lg:hidden h-screen flex flex-col items-center justify-center gap-y-1 bg-white">
          <h1 className="sr-only">모바일, 태블릿 접근 불가 안내</h1>
          <div className="flex flex-col">
            <p className="text-lg text-center">포트폴리오의 원활한 이용을 위해</p>
            <p className="text-lg text-center">
              <span className="font-semibold">모바일 기기를 통한 접근을 제한</span>하였습니다
            </p>
          </div>
          <p className="text-sub-gray text-sm text-center">불편하시겠지만 노트북 또는 컴퓨터로 접속해주시기 바랍니다🙂</p>
        </div>

        {/* 1024px 초과: 데스크톱 레이아웃 */}
        <div className="hidden lg:flex h-screen relative">
          <h1 className="sr-only">최영준의 포트폴리오</h1>

          {/* 회사명 모달 */}
          <GetCompanyNameModal />

          {/* 메뉴 */}
          <Navigation />

          {/* 컨텍스트 */}
          <main className="overflow-y-scroll flex flex-col items-center w-full">{children}</main>

          {/* 업데이트 */}
          <div className="fixed bottom-6 right-4 text-[8px] text-sub-gray font-semibold">
            <p className="text-right">Haiku 4.5</p>
            <p className="text-right">updated 26/2/25</p>
          </div>
        </div>
        <div></div>
      </body>
    </html>
  );
}
