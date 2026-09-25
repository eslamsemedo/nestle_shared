/** The product summary embedded in stock requests and issues (only the fields the app shows). */
export interface StockProductRef {
  id: number;
  code: string;
  name: string;
}

export interface SalesmanStockRequestItem {
  id: number;
  product_id: number;
  /** Decimal string, e.g. "10.000" — shown as sent. */
  requested_quantity_cartons: string;
  product: StockProductRef | null;
}

/** `GET /api/my/salesman-stock-requests` item and `POST /api/salesman-stock-requests` data. */
export interface SalesmanStockRequest {
  id: number;
  request_no: string;
  daily_session_id: number;
  /** Seen: `submitted`, `processed`. */
  status: string;
  submitted_at: string | null;
  processed_at: string | null;
  notes: string | null;
  items: SalesmanStockRequestItem[];
}

export interface CreateSalesmanStockRequestBody {
  daily_session_id: number;
  items: { product_id: number; requested_quantity_cartons: number }[];
  notes?: string;
}

export interface StockIssueItem {
  id: number;
  product_id: number;
  quantity_cartons: number;
  product: StockProductRef | null;
}

/** `GET /api/my/pending-stock-issues` item and `POST /api/stock-issues/{id}/confirm` data. */
export interface StockIssue {
  id: number;
  issue_no: string;
  daily_session_id: number;
  salesman_stock_request_id: number | null;
  /** Seen: `draft`, `issued`, `confirmed`. */
  status: string;
  issued_at: string | null;
  confirmed_at: string | null;
  notes: string | null;
  items: StockIssueItem[];
  warehouse: { id: number; code: string; name: string } | null;
}
