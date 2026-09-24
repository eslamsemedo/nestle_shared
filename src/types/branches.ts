import type { ListResponse } from './common.js';

/** `BranchController::present` */
export interface Branch {
  id: number;
  code: string;
  name: string;
  city: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
}

export type BranchesResponse = ListResponse<Branch>;
