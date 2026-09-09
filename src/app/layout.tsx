import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'OPEN ON - 열린컴퍼니 통합 일정',
  description: '열린컴퍼니 직원용 내부 일정관리 앱',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-100 text-slate-900 antialiased min-h-screen">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm relative">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
