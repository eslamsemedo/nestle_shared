export type RefrigeratorStatus = 'NEW' | 'IN_STORE' | 'WITH_CUSTOMER' | 'DAMAGED' | 'SCRAP';
export type FridgePeriod = 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';

/** `GET /api/refrigerator-stocktakes` row. */
export interface FridgeStocktakeRow {
  id: number;
  stocktake_no: string;
  business_date: string;
  period_type: string;
  status: string;
}

export interface FridgeStocktakeItem {
  refrigerator_id: number;
  code: string;
  expected_status: string | null;
  expected_at: string | null;
  found_status: string | null;
  verdict: string | null;
  counted: boolean;
  notes: string | null;
}

/** `GET /api/refrigerator-stocktakes/{id}` and the open response `data`. */
export interface FridgeStocktake extends FridgeStocktakeRow {
  branch_id: number;
  counted_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  summary: { total: number; not_counted_yet: number; matched: number; state_differs: number; not_found: number };
  items: FridgeStocktakeItem[];
}

export interface OpenFridgeStocktakeBody {
  period_type: FridgePeriod;
}

/** `found_status: null` records the fridge as not found; the key is always sent. */
export interface RecordFridgeItemBody {
  refrigerator_id: number;
  found_status: RefrigeratorStatus | null;
  notes?: string;
}

export interface RecordFridgeItemResponse {
  success: true;
  data: { refrigerator_id: number; verdict: string };
}
