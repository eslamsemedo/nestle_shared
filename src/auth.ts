import type { Permission } from './generated/permissions.js';

export interface EmployeeBranch {
  id: number;
  code: string;
  name: string;
  city: string | null;
  is_active: boolean;
}

export interface Employee {
  id: number;
  employee_code: string;
  name: string;
  phone: string | null;
  job_title: string | null;
  position_code: string | null;
  is_active: boolean;
  branch_id: number | null;
  branch?: EmployeeBranch | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  /** Present on `GET /api/me`; absent on the login response (relation not loaded). */
  employee?: Employee | null;
  roles: string[];
  permissions: Permission[];
}

export interface LoginRequest {
  email: string;
  password: string;
  device_name: string;
}

export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  expires_at: string;
  user: User;
}

export interface MeResponse {
  success: true;
  user: User;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** An unparseable date counts as expired — safer to ask for a login than to trust it. */
export function isTokenExpired(expiresAt: string, now: Date = new Date()): boolean {
  const time = Date.parse(expiresAt);
  return Number.isNaN(time) || time <= now.getTime();
}

export function isTokenExpiring(expiresAt: string, now: Date = new Date(), marginDays = 3): boolean {
  if (isTokenExpired(expiresAt, now)) return false;
  return Date.parse(expiresAt) - now.getTime() < marginDays * DAY_MS;
}
