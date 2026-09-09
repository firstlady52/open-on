'use client';

import { useState } from 'react';
import { EventItem } from '@/types';

interface CalendarProps {
  events: EventItem[];
  onSelectDate: (date: string) => void;
}

export default function MonthCalendar({ events, onSelectDate }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState('2026-10-14');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-sm font-bold text-slate-800">&lt; 2026년 10월 &gt;</span>
        <button
          onClick={() => {
            setSelectedDay('2026-10-14');
            onSelectDate('2026-10-14');
          }}
          className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium"
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
        {daysInMonth.map(({ day, dateStr }) => {
          const dayEvents = getDotsForDate(dateStr);
          const isSelected = dateStr === selectedDay;

          return (
            <button
              key={dateStr}
              onClick={() => {
                setSelectedDay(dateStr);
                onSelectDate(dateStr);
              }}
              className={`h-12 border border-slate-50 rounded-xl flex flex-col items-center justify-between py-1 transition-all ${
                isSelected ? 'ring-2 ring-teal-600 bg-teal-50/30' : 'hover:bg-slate-50'
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
