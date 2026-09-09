import * as XLSX from 'xlsx';
import { EventItem } from '@/types';

export function createFingerprint(item: Partial<EventItem>): string {
  const raw = `${item.project_name}_${item.start_date}_${item.start_time || ''}_${item.instructor_name || item.coach_name || ''}_${item.location || item.participant_name || ''}_${item.round_label || ''}`;
  return btoa(unescape(encodeURIComponent(raw)));
}

export function parseTextSchedule(text: string): EventItem[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results: EventItem[] = [];
  let currentProject = '팀빌딩';

  for (const line of lines) {
    if (line.includes('팀빌딩')) { currentProject = '팀빌딩'; continue; }
    if (line.includes('리더십')) { currentProject = '리더십'; continue; }

    const regex = /(?:(\d+[기차])[:\s]*)?(\d{1,2})월\s*(\d{1,2})일?\s*[~-]\s*(?:(\d{1,2})월\s*)?(\d{1,2})일?/;
    const match = line.match(regex);

    if (match) {
      const roundLabel = match[1] || '';
      const startMonth = match[2].padStart(2, '0');
      const startDay = match[3].padStart(2, '0');
      const endMonth = (match[4] || match[2]).padStart(2, '0');
      const endDay = match[5].padStart(2, '0');

      const item: EventItem = {
        id: Math.random().toString(36).substring(2, 9),
        project_id: 'p3',
        project_name: currentProject,
        round_label: roundLabel,
        start_date: `2026-${startMonth}-${startDay}`,
        end_date: `2026-${endMonth}-${endDay}`,
        has_error: false
      };
      item.source_key = createFingerprint(item);
      results.push(item);
    } else {
      results.push({
        id: Math.random().toString(36).substring(2, 9),
        project_id: 'p3',
        project_name: currentProject,
        start_date: '',
        has_error: true,
        error_message: '문장 구조 분석 실패 (확인 필요)'
      });
    }
  }
  return results;
}

export function parseDaewooExcel(buffer: ArrayBuffer): EventItem[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  return rows.map((row, idx) => {
    const date = row['교육일'] || row['날짜'];
    const time = row['시간'] || '10:00';
    const instructor = row['강사'] || row['강사명'];
    const location = row['현장명'] || row['현장'];

    if (!date || !instructor) {
      return {
        id: `err-${idx}`,
        project_id: 'p1',
        project_name: '대우ST',
        start_date: '',
        has_error: true,
        error_message: '필수 데이터 누락'
      };
    }

    const item: EventItem = {
      id: `dw-${idx}`,
      project_id: 'p1',
      project_name: '대우ST',
      start_date: String(date).replace(/\./g, '-'),
      start_time: String(time),
      instructor_name: String(instructor),
      location: String(location || ''),
      has_error: false
    };
    item.source_key = createFingerprint(item);
    return item;
  });
}
