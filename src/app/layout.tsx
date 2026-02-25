import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GetCompanyNameModal } from '@entities/company';
import { GoogleAnalytics } from '@next/third-parties/google';
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
  title: '최영준의 포트폴리오',
  description: '최영준의 포트폴리오',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />

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
          <div className="fixed bottom-3 right-4 text-[10px] text-black/50 font-semibold">
            <p className="text-right">Haiku 4.5</p>
            <p>updated 2026. 2. 24</p>
          </div>
        </div>
        <div></div>
      </body>
    </html>
  );
}
