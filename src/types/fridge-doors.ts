import type { Money } from './common.js';

/*
 * ضلف الثلاجات — `RefrigeratorDoorService::presentCase` / `presentOrder`.
 * A case is one broken-door charge on a shop; an order batches cases to the company.
 */

export type FridgeDoorCaseStatus = 'REQUESTED' | 'ORDERED' | 'RECEIVED' | 'INSTALLED' | 'CANCELLED';
export type FridgeDoorOrderStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';

export interface FridgeDoorCase {
  id: number;
  case_no: string;
  status: FridgeDoorCaseStatus;
  customer: { id: number | null; code: string | null; name: string | null };
  refrigerator: { id: number; code: string } | null;
  doors_count: number;
  unit_price: Money;
  total_amount: Money;
  /** From the shop's receivable — what collections update. */
  paid_amount: Money;
  remaining_amount: Money;
  receivable_id: number | null;
  receivable_no: string | null;
  order: { id: number; order_no: string; status: FridgeDoorOrderStatus } | null;
  requested_by: string | null;
  requested_on: string | null;
  installed_by: string | null;
  installed_on: string | null;
  notes: string | null;
}

/** `GET /api/fridge-door-cases` `data`. The summary leaves cancelled cases out. */
export interface FridgeDoorCasesData {
  summary: {
    cases: number;
    doors: number;
    charged: Money;
    collected: Money;
    remaining: Money;
    waiting_for_order: number;
    waiting_to_install: number;
  };
  cases: FridgeDoorCase[];
}

export interface CreateFridgeDoorCaseBody {
  customer_id: number;
  /** Must be at this customer now, or `DOR_005`. */
  refrigerator_id?: number;
  /** 1–20. */
  doors_count: number;
  /** The price the shop pays per door, as typed. */
  unit_price: string;
  requested_on?: string;
  notes?: string;
}

export interface InstallFridgeDoorCaseBody {
  installed_on?: string;
  notes?: string;
}

/** One row of `GET /api/fridge-door-orders` `data`. */
export interface FridgeDoorOrder {
  id: number;
  order_no: string;
  status: FridgeDoorOrderStatus;
  supplier: string | null;
  doors_count: number;
  unit_cost: Money;
  total_cost: Money;
  charged_to_customers: Money;
  collected_from_customers: Money;
  remaining_on_customers: Money;
  created_by: string | null;
  sent_at: string | null;
  received_on: string | null;
  received_by: string | null;
  notes: string | null;
  cases: FridgeDoorCase[];
}

export interface CreateFridgeDoorOrderBody {
  /** `REQUESTED` cases of this branch not on another order, or `DOR_004`. */
  case_ids: number[];
  /** The company's price per door for this order, as typed. */
  unit_cost: string;
  supplier_id?: number;
  notes?: string;
}

export interface ReceiveFridgeDoorOrderBody {
  received_on?: string;
}
