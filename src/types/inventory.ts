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

/** `GET /api/vehicle-inventory-counts/pending` row: a returned van waiting for the inventory controller. */
export interface PendingVanCount {
  daily_session_id: number;
  session_no: string;
  business_date: string;
  status: string;
  salesman: string | null;
  vehicle: string | null;
  plate_number: string | null;
  route: string | null;
  returned_at: string | null;
}

export interface PendingVanCountsResponse {
  success: true;
  data: PendingVanCount[];
}

export interface VanCountSheetLine {
  product_id: number;
  product: { id: number; code: string; name: string };
  system_quantity_cartons: number;
}

/** `GET /api/daily-sessions/{id}/count-sheet`. */
export interface VanCountSheetResponse {
  success: true;
  trip: { id: number; session_no: string; business_date: string; status: string; vehicle_id: number };
  data: VanCountSheetLine[];
}

export interface CreateVanCountBody {
  daily_session_id: number;
  items: { product_id: number; actual_quantity_cartons: number }[];
  notes?: string;
}

/** `POST /api/vehicle-inventory-counts` response `data`. */
export interface VanCount {
  id: number;
  status: string;
  counted_at: string;
  daily_session_id: number;
  salesman: { id: number; name: string } | null;
  summary: { lines_counted: number; lines_short: number; lines_over: number; cartons_short: number; cartons_over: number };
  items: {
    product_id: number;
    product: { id: number; code: string; name: string };
    system_quantity_cartons: number;
    actual_quantity_cartons: number;
    difference_quantity_cartons: number;
    difference_type: 'BALANCED' | 'SHORTAGE' | 'EXCESS' | string;
  }[];
}
