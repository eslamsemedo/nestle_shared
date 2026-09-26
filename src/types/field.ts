/** `GET /api/vehicles` row. `status` is shown as sent (seeded data mixes case). */
export interface Vehicle {
  id: number;
  branch_id: number;
  code: string;
  plate_number: string;
  model: string | null;
  status: string;
  notes: string | null;
  is_active: boolean;
}

/** `GET /api/routes` row. */
export interface RouteRow {
  id: number;
  branch_id: number;
  code: string;
  name: string;
  description: string | null;
  stop_count: number;
  is_active: boolean;
}

/** `GET /api/employees` row (fields the field screens use). */
export interface EmployeeRow {
  id: number;
  branch_id: number | null;
  employee_code: string;
  name: string;
  job_title: string | null;
  position_code: string | null;
  is_active: boolean;
}

/** `{ success, data: T[] }` reads that carry extra top-level keys (summary, meta). */
export interface DataListResponse<T> {
  success: true;
  data: T[];
}
