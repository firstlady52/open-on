export type ProjectType = '대우ST' | '홈앤코칭' | '팀빌딩' | '리더십' | string;

export interface Project {
  id: string;
  name: ProjectType;
  color: string;
  is_active: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  phone?: string;
  base_region?: string;
}

export interface EventItem {
  id: string;
  project_id: string;
  project_name: ProjectType;
  project_color?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  instructor_id?: string;
  instructor_name?: string;
  location?: string;
  participant_name?: string;
  coach_name?: string;
  round_label?: string;
  status?: '확정' | '조율중' | '완료';
  source_key?: string;
  is_duplicate?: boolean;
  has_error?: boolean;
  error_message?: string;
}

export interface ProjectInstructorFee {
  id: string;
  project_id: string;
  instructor_id: string;
  fee: number;
  note?: string;
}
