'use client';

import { useState, useEffect } from 'react';
import { EventItem } from '@/types';

interface CalendarProps {
  events: EventItem[];
  onSelectDate: (date: string) => void;
}

export default function MonthCalendar({ events, onSelectDate }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // 앱 실행 시 오늘 날짜로 초기화
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDay(todayStr);
    setCurrentDate(today);
  }, []);

  // 달력을 그리기 위한 날짜 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0부터 시작 (8 = 9월)

  // 이번 달 1일이 무슨 요일인지 계산 (0: 일요일 ~ 6: 토요일)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // 이번 달이 며칠까지 있는지 계산 (예: 9월은 30일)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 1일이 시작하기 전까지의 빈 칸 배열
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // 이번 달의 실제 날짜 배열
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, dateStr };
  });

  const getDotsForDate = (dateStr: string) => {
    return events.filter(e => {
      if (e.end_date) {
        return dateStr >= e.start_date && dateStr <= e.end_date;
      }
      return e.start_date === dateStr;
    });
  };

  const getColorClass = (name: string) => {
    switch (name) {
      case '대우ST': return 'bg-teal-500';
      case '홈앤코칭': return 'bg-emerald-500';
      case '팀빌딩': return 'bg-orange-400';
      case '리더십': return 'bg-purple-500';
      default: return 'bg-slate-400';
    }
  };

  // '오늘' 버튼 클릭 시
  const handleTodayClick = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    setCurrentDate(today);
    setSelectedDay(todayStr);
    onSelectDate(todayStr);
  };

  // 클라이언트 렌더링 전 빈 화면 방지
  if (!selectedDay) return <div className="h-64 animate-pulse bg-slate-50 rounded-xl"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-sm font-bold text-slate-800">
          &lt; {year}년 {month + 1}월 &gt;
        </span>
        <button
          type="button"
          onClick={handleTodayClick}
          className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium active:scale-95 transition-transform"
        >
          오늘
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
        <span className="text-red-400">일</span>
        <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span>
        <span className="text-blue-400">토</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* 1일 이전의 빈 칸 그리기 */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-12"></div>
        ))}

        {/* 실제 날짜 그리기 */}
        {days.map(({ day, dateStr }) => {
          const dayEvents = getDotsForDate(dateStr);
          const isSelected = dateStr === selectedDay;
          
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => {
                setSelectedDay(dateStr);
                onSelectDate(dateStr);
              }}
              className={`h-12 border rounded-xl flex flex-col items-center justify-between py-1 transition-all active:scale-95 ${
                isSelected 
                  ? 'border-teal-600 bg-teal-50/30 ring-1 ring-teal-600' 
                  : 'border-slate-50 hover:bg-slate-50'
              }`}
            >
              <span className={`text-xs ${isSelected ? 'font-bold text-teal-800' : 'text-slate-700'}`}>
                {day}
              </span>
              <div className="flex gap-0.5 justify-center flex-wrap max-w-[28px]">
                {dayEvents.slice(0, 4).map((e, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${getColorClass(e.project_name)}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
