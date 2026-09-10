'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { EventItem } from '@/types';

export default function MorePage() {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        if (wb.SheetNames.length > 0) {
          setSelectedSheet(wb.SheetNames[0]);
        }
      } catch (err) {
        alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleParseAndSave = () => {
    if (!workbook || !selectedSheet) {
      alert('파일과 시트를 선택해 주세요.');
      return;
    }

    const worksheet = workbook.Sheets[selectedSheet];
    // 5번째 줄(Index 4)을 헤더로 읽어옴
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { range: 4 });

    const newEvents: EventItem[] = rawData
      .filter(row => row['교육일']) // 교육일이 있는 행만 추출
      .map((row, index) => {
        // 날짜 형식 정리 (2026-09-01)
        let rawDate = String(row['교육일']).trim();
        if (rawDate.includes('.')) {
          rawDate = rawDate.replace(/\./g, '-');
        }

        return {
          id: `excel-${index}-${Date.now()}`,
          project_id: `p-${index}`,
          project_name: row['과업명'] || '대우ST',
          start_date: rawDate,
          start_time: String(row['시간'] || ''),
          instructor_name: String(row['강사'] || ''),
          location: String(row['현장명'] || ''),
          status: String(row['진행상태'] || ''),
        };
      });

    if (newEvents.length === 0) {
      alert('일정 데이터를 찾을 수 없습니다. 엑셀의 열 이름(교육일, 시간, 강사, 현장명)을 확인해 주세요.');
      return;
    }

    // 브라우저 저장소에 실제 일정 저장
    localStorage.setItem('open_on_events', JSON.stringify(newEvents));
    alert(`총 ${newEvents.length}건의 실제 일정이 등록되었습니다! 메인 화면으로 이동합니다.`);
    window.location.href = '/';
  };

  return (
    <main className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-white">
      <h1 className="text-lg font-bold text-slate-800 mb-6">엑셀 일정 가져오기</h1>

      <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">1. 엑셀 파일 선택</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        {sheetNames.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">2. 일정 시트(탭) 선택</label>
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              {sheetNames.map((name, idx) => (
                <option key={name} value={name}>{idx + 1}번째 탭: {name}</option>
              ))}
            </select>
          </div>
        )}

        {sheetNames.length > 0 && (
          <button
            onClick={handleParseAndSave}
            className="w-full py-3 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            선택한 시트 일정 앱에 반영하기
          </button>
        )}
      </div>
    </main>
  );
}
