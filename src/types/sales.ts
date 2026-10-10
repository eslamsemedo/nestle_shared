import type { Money } from './common.js';
import type { StockProductRef } from './stock.js';

/** `POST /api/customer-visits` and `/complete` data. */
export interface CustomerVisit {
  id: number;
  visit_no: string;
  daily_session_id: number;
  customer_id: number;
  /** `started`, then the outcome the server sets on complete (e.g. `sale`, `no_sale`). */
  status: string;
  started_at: string | null;
  completed_at?: string | null;
  notes: string | null;
}

export interface StartVisitBody {
  daily_session_id: number;
  customer_id: number;
  /** Omitted when the phone could not get a location (refused or timed out). */
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export type PaymentType = 'CASH' | 'CREDIT';

/** A line is sold by the carton or by the piece, never both (PRD_007). */
export interface SaleLineBody {
  product_id: number;
  quantity_cartons?: number;
  quantity_pieces?: number;
}

/** `client_transaction_uuid` is added by `withTransactionUuid`. */
export interface CreateSaleBody {
  customer_visit_id: number;
  salesbuzz_invoice_no: string;
  payment_type: PaymentType;
  items: SaleLineBody[];
  /** Credit sales only; when absent the backend derives it from the customer's credit period. */
  due_date?: string;
  notes?: string;
}

export interface SaleItem {
  id: number;
  product_id: number;
  quantity_cartons: number;
  quantity_pieces: number;
  bonus_quantity: number;
  unit_price: Money;
  gross_amount: Money;
  discount_amount: Money;
  net_amount: Money;
  product: StockProductRef | null;
}

/** `POST /api/sales` data (201). The same uuid again returns this same record. */
export interface Sale {
  id: number;
  sale_no: string;
  client_transaction_uuid: string;
  customer_visit_id: number;
  customer_id: number;
  salesbuzz_invoice_no: string;
  payment_type: PaymentType;
  subtotal: Money;
  discount_total: Money;
  tpp_amount: Money;
  tax_amount: Money;
  net_total: Money;
  due_date: string | null;
  status: string;
  sold_at: string | null;
  items: SaleItem[];
}
