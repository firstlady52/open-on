import { EventItem } from '@/types';

export default function EventCard({ event }: { event: EventItem }) {
  const formatDate = (d?: string) => (d ? d.slice(5).replace('-', '/') : '');

  return (
    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 font-medium">
      {/* A. 대우ST */}
      {event.project_name === '대우ST' && (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-teal-700">[대우ST]</span>
          <span>{event.start_time?.slice(0, 5)}</span>
          <span className="font-semibold">{event.instructor_name}</span>
          <span className="text-slate-400">|</span>
          <span>{event.location}</span>
        </div>
      )}

      {/* B. 홈앤코칭 */}
      {event.project_name === '홈앤코칭' && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-emerald-700">[홈앤코칭]</span>
          <span>
            {event.participant_name}({event.coach_name})
          </span>
          <span>· {event.round_label}</span>
          <span>· {event.start_time?.slice(0, 5)}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              event.status === '확정'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {event.status}
          </span>
        </div>
      )}

      {/* C. 팀빌딩 */}
      {event.project_name === '팀빌딩' && (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-orange-600">[팀빌딩]</span>
          <span className="font-semibold">{event.round_label}</span>
          <span>·</span>
          <span>
            {formatDate(event.start_date)}~{formatDate(event.end_date)}
          </span>
        </div>
      )}

      {/* D. 리더십 */}
      {event.project_name === '리더십' && (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-purple-700">[리더십]</span>
          <span className="font-semibold">{event.round_label}</span>
          <span>·</span>
          <span>
            {formatDate(event.start_date)}~{formatDate(event.end_date)}
          </span>
        </div>
      )}
    </div>
  );
}
