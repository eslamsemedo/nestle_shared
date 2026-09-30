/** Storekeeper write flows: stock issue, stock-closing confirm, replacement prepare, stocktakes. */

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string | null;
  is_active: boolean;
  branch_id: number;
  branch: string | null;
}

/** `GET /api/warehouses` (not paged). */
export interface WarehousesResponse {
  success: true;
  summary: { count: number };
  data: Warehouse[];
}

/** `{ success, data, meta }` paged lists. */
export interface PagedListResponse<T> {
  success: true;
  data: T[];
  meta: { total: number; per_page: number; current_page: number; last_page: number };
}

export interface PendingStockRequestItem {
  id: number;
  product_id: number;
  /** Decimal string, e.g. "10.000" (cartons, not money). */
  requested_quantity_cartons: string;
  product: { id: number; code: string; name: string };
}

/** `GET /api/pending-salesman-stock-requests` item (only the fields the app shows). */
export interface PendingStockRequest {
  id: number;
  request_no: string;
  daily_session_id: number;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  salesman: { id: number; name: string };
  vehicle: { id: number; code: string; plate_number: string } | null;
  session: { id: number; session_no: string; business_date: string; trip_no: number | string | null; status: string } | null;
  items: PendingStockRequestItem[];
}

/** No `success` key on this list. */
export interface PendingStockRequestsResponse {
  data: PendingStockRequest[];
}

export interface CreateStockIssueBody {
  salesman_stock_request_id: number;
  warehouse_id: number;
  items: { product_id: number; quantity_cartons: number }[];
  notes?: string;
}

export interface StockClosingListItem {
  id: number;
  closing_no: string;
  status: string;
  daily_session_id: number;
  business_date: string;
  trip_no: number | string | null;
  vehicle: string | null;
  salesman_id: number;
  salesman: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  confirmed_at: string | null;
}

/** `GET /api/daily-stock-closings` (not paged). */
export interface StockClosingsResponse {
  success: true;
  summary: { count: number };
  data: StockClosingListItem[];
}

export interface ConfirmStockClosingBody {
  warehouse_id: number;
  items: { product_id: number; received_quantity_cartons: number }[];
  notes?: string;
}

export interface ConfirmedClosingItem {
  product_id: number;
  system_quantity_cartons: number;
  salesman_counted_quantity_cartons: number;
  storekeeper_received_quantity_cartons: number;
  shortage_quantity_cartons: number;
  excess_quantity_cartons: number;
  product: { name: string };
}

/** `data` of `POST /api/daily-stock-closings/{id}/confirm`. */
export interface ConfirmedStockClosing {
  id: number;
  closing_no: string;
  status: string;
  items: ConfirmedClosingItem[];
}

export interface ReplacementListItem {
  id: number;
  customer_return_id: number;
  customer: { id: number; customer_code: string; name: string };
  salesman: { id: number; name: string } | null;
  status: string;
  line_count: number;
  created_at: string;
}

export interface PrepareReplacementBody {
  warehouse_id: number;
  notes?: string;
}

export type StocktakeType = 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';

export interface StocktakeItem {
  product_id: number;
  product: string;
  code: string;
  system_cartons: number;
  counted_cartons: number;
  difference: number;
}

/** Money fields (unit cost, difference value) are left out: these screens never show money. */
export interface Stocktake {
  id: number;
  stocktake_no: string;
  warehouse: string;
  type: StocktakeType;
  business_date: string;
  status: string;
  counted_by: string | null;
  counted_at: string | null;
  items: StocktakeItem[];
  summary: { lines: number; short_lines: number; over_lines: number };
}

/** `GET /api/stocktakes` (not paged). */
export interface StocktakesResponse {
  success: true;
  data: Stocktake[];
}

export interface CreateStocktakeBody {
  warehouse_id: number;
  type: StocktakeType;
  business_date: string;
  items: { product_id: number; counted_cartons: number }[];
  notes?: string;
}

export interface CatalogueProduct {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
}

/** `GET /api/products` (paged). */
export type ProductsResponse = PagedListResponse<CatalogueProduct>;
