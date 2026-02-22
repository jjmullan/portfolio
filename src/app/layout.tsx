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
        <div className="h-screen flex">
          <h1 className="sr-only">최영준의 포트폴리오</h1>

          {/* 회사명 모달 */}
          <GetCompanyNameModal />

          {/* 메뉴 */}
          <Navigation />
          {/* 컨텍스트 */}
          <main className="overflow-y-scroll flex flex-col items-center justify-center w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
