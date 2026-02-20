import Navigation from '@widgets/navigation/Navigation';

export default function Home() {
  return (
    <div className="grid grid-cols-[280px_1fr] h-screen">
      <h1 className="sr-only">최영준의 포트폴리오</h1>

      {/* 메뉴 */}
      <Navigation />

      {/* 메인 */}
      <main className="overflow-y-scroll">dfdf</main>
    </div>
  );
}
