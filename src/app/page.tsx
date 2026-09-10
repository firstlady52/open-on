'use client';

import { useState, useEffect } from 'react';
import MonthCalendar from '@/components/MonthCalendar';
import EventCard from '@/components/EventCard';
import { EventItem } from '@/types';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-09-10');

  useEffect(() => {
    // 1. 오늘 날짜 설정
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(todayStr);

    // 2. 저장소에서 실제 업로드된 일정 가져오기
    const saved = localStorage.getItem('open_on_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const filteredEvents = events.filter(e => {
    if (e.end_date) {
      return selectedDate >= e.start_date && selectedDate <= e.end_date;
    }
    return e.start_date === selectedDate;
  });

  // 과업별 건수 계산
  const projectCounts = events.reduce((acc, curr) => {
    const name = curr.project_name || '기타';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-white">
      {/* 요약 카드 3종 */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">전체 일정</span>
          <span className="text-lg font-bold text-slate-800">{events.length}<span className="text-xs font-normal">건</span></span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">선택일 일정</span>
          <span className="text-lg font-bold text-teal-700">{filteredEvents.length}<span className="text-xs font-normal">건</span></span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-left shadow-sm">
          <span className="text-[11px] text-slate-400 font-medium block">진행 과업</span>
          <span className="text-lg font-bold text-slate-800">{Object.keys(projectCounts).length}<span className="text-xs font-normal">개</span></span>
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm mb-6">
        <MonthCalendar events={events} onSelectDate={(d) => setSelectedDate(d)} />
      </div>

      {/* 일자별 일정 현황 */}
      <section className="mb-6">
        <h2 className="text-xs font-bold text-slate-700 mb-2.5">
          {selectedDate} 일정 ({filteredEvents.length}건)
        </h2>
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl">
              등록된 일정이 없습니다.
            </div>
          ) : (
            filteredEvents.map(e => <EventCard key={e.id} event={e} />)
          )}
        </div>
      </section>

      {/* 과업별 일정 현황 요약 */}
      {Object.keys(projectCounts).length > 0 && (
        <section className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-slate-400 mb-2">과업별 일정 현황</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(projectCounts).map(([name, count]) => (
              <div key={name} className="p-2.5 rounded-xl bg-teal-50 text-teal-900 flex justify-between font-medium">
                <span>{name}</span>
                <span>{count}건</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
