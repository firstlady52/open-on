'use client';

import { useState } from 'react';
import { parseDaewooExcel, parseTextSchedule } from '@/lib/parsers';
import { EventItem } from '@/types';

export default function MorePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [adminTab, setAdminTab] = useState<'excel' | 'text' | 'fee'>('excel');
  const [selectedProject, setSelectedProject] = useState('대우ST');

  const [previewEvents, setPreviewEvents] = useState<EventItem[]>([]);
  const [rawText, setRawText] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setIsAdmin(true);
    else alert('관리자 비밀번호가 올바르지 않습니다.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    if (selectedProject === '대우ST') {
      const parsed = parseDaewooExcel(buffer);
      setPreviewEvents(parsed);
    }
  };

  const handleTextParse = () => {
    const parsed = parseTextSchedule(rawText);
    setPreviewEvents(parsed);
  };

  return (
    <main className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-white">
      <h1 className="text-base font-bold text-slate-800 mb-4">더보기</h1>

      {!isAdmin ? (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
            <div className="font-bold text-slate-700">이용가이드</div>
            <p className="text-slate-500">열린컴퍼니 통합 일정관리 시스템 OPEN ON입니다.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-3">
            <div className="font-bold text-slate-700">관리자 모드 접속</div>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
            />
            <button
              onClick={handleLogin}
              className="w-full py-2.5 bg-teal-800 text-white font-bold rounded-xl active:bg-teal-900"
            >
              인증하기
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 border-b border-slate-100 pb-2 text-xs font-bold">
            <button
              onClick={() => setAdminTab('excel')}
              className={`pb-1 ${adminTab === 'excel' ? 'text-teal-800 border-b-2 border-teal-800' : 'text-slate-400'}`}
            >
              엑셀 가져오기
            </button>
            <button
              onClick={() => setAdminTab('text')}
              className={`pb-1 ${adminTab === 'text' ? 'text-teal-800 border-b-2 border-teal-800' : 'text-slate-400'}`}
            >
              텍스트 등록
            </button>
            <button
              onClick={() => setAdminTab('fee')}
              className={`pb-1 ${adminTab === 'fee' ? 'text-teal-800 border-b-2 border-teal-800' : 'text-slate-400'}`}
            >
              섭외비용 관리
            </button>
          </div>

          {adminTab === 'excel' && (
            <div className="space-y-3 text-xs">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
              >
                <option value="대우ST">대우ST</option>
                <option value="홈앤코칭">홈앤코칭</option>
              </select>

              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="w-full text-slate-500"
              />

              {previewEvents.length > 0 && (
                <div className="mt-4 border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-700">
                    미리보기 ({previewEvents.length}건 인식)
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {previewEvents.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border text-[11px] ${
                          item.has_error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100'
                        }`}
                      >
                        {item.has_error ? (
                          <span>오류: {item.error_message}</span>
                        ) : (
                          <span>
                            {item.start_date} | {item.start_time} | {item.instructor_name} | {item.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => alert('일정이 성공적으로 등록되었습니다.')}
                    className="w-full py-2 bg-teal-800 text-white font-bold rounded-lg mt-2"
                  >
                    일정 등록하기
                  </button>
                </div>
              )}
            </div>
          )}

          {adminTab === 'text' && (
            <div className="space-y-3 text-xs">
              <textarea
                rows={5}
                placeholder={"카카오톡 일정 문구를 복사해 붙여넣으세요.\n예:\n팀빌딩\n6기: 10월 12-14일"}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
              <button
                onClick={handleTextParse}
                className="w-full py-2 bg-teal-800 text-white font-bold rounded-xl"
              >
                일정 분석하기
              </button>

              {previewEvents.length > 0 && (
                <div className="mt-4 border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-700">분석 결과 미리보기</div>
                  {previewEvents.map((item, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border border-slate-100 text-[11px]">
                      {item.has_error ? (
                        <span className="text-red-500">{item.error_message}</span>
                      ) : (
                        <span>
                          [{item.project_name}] {item.round_label} · {item.start_date} ~ {item.end_date}
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => alert('일정이 등록되었습니다.')}
                    className="w-full py-2 bg-teal-800 text-white font-bold rounded-lg mt-2"
                  >
                    일정 등록하기
                  </button>
                </div>
              )}
            </div>
          )}

          {adminTab === 'fee' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="font-bold text-slate-700">단가 등록 (과업 × 강사)</div>
                <select className="w-full p-2 border border-slate-200 rounded-lg bg-white">
                  <option>대우ST</option>
                  <option>홈앤코칭</option>
                </select>
                <input type="text" placeholder="강사명" className="w-full p-2 border border-slate-200 rounded-lg" />
                <input type="number" placeholder="섭외비용 (원)" className="w-full p-2 border border-slate-200 rounded-lg" />
                <button
                  onClick={() => alert('단가가 저장되었습니다.')}
                  className="w-full py-2 bg-teal-800 text-white font-bold rounded-lg"
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
