'use client';

import { useState, useEffect } from 'react';
import MonthCalendar from '@/components/MonthCalendar';
import EventCard from '@/components/EventCard';
import { EventItem } from '@/types';

const MOCK_EVENTS: EventItem[] = [
  { id: '1', project_id: 'p1', project_name: '대우ST', start_date: '2026-09-10', start_time: '10:00', instructor_name: '이은선', location: '영통푸르지오' },
  { id: '2', project_id: 'p2', project_name: '홈앤코칭', start_date: '2026-09-10', start_time: '10:00', participant_name: '김진수', coach_name: '신호진', round_label: '1차', status: '확정' },
  { id: '3', project_id: 'p3', project_name: '팀빌딩', start_date: '2026-09-08', end_date: '2026-09-12', round_label: '6기' },
  { id: '4', project_id: 'p4', project_name: '리더십', start_date: '2026-09-21', end_date: '2026-09-23', round_label: '2차' },
];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('2026-09-10');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const filteredEvents = MOCK_EVENTS.filter(e => {
    if (e.end_date) {
      return selectedDate >= e.start_date && selectedDate <= e.end_date;
    }
    return e.start_date === selectedDate;
  });

  return (
    <main className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-white">
      {/* 요약 카드 3종 */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">오늘 일정</span>
          <span className="text-lg font-bold text-slate-800">2<span className="text-xs font-normal">건</span></span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">이번 주 일정</span>
          <span className="text-lg font-bold text-slate-800">3<span className="text-xs font-normal">건</span></span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">진행 과업</span>
          <span className="text-lg font-bold text-teal-700">4<span className="text-xs font-normal">개</span></span>
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm mb-6">
        <MonthCalendar events={MOCK_EVENTS} onSelectDate={(d) => setSelectedDate(d)} />
      </div>

      {/* 일자별 일정 현황 */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-slate-700 mb-2.5">
          {selectedDate} 일정 ({filteredEvents.length}건)
        </h2>
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl">
              일정이 없습니다.
            </div>
          ) : (
            filteredEvents.map(e => <EventCard key={e.id} event={e} />)
          )}
        </div>
      </section>

      {/* 과업별 일정 현황 요약 */}
      <section className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-bold text-slate-400 mb-2">과업별 일정 현황</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-900 flex justify-between font-medium">
            <span>대우ST</span>
            <span>1건</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 flex justify-between font-medium">
            <span>홈앤코칭</span>
            <span>1건</span>
          </div>
        </div>
      </section>
    </main>
  );
}
