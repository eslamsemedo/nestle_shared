import type { Money } from './common.js';

export interface CreateStockClosingBody {
  daily_session_id: number;
  /** Every product on the truck; an empty array is valid for an empty truck. */
  items: { product_id: number; counted_quantity_cartons: number }[];
  notes?: string;
}

export interface StockClosingItem {
  id: number;
  product_id: number;
  system_quantity_cartons: number;
  salesman_counted_quantity_cartons: number;
  storekeeper_received_quantity_cartons: number | null;
  shortage_quantity_cartons: number;
  excess_quantity_cartons: number;
}

/** `POST /api/daily-stock-closings` data (201). */
export interface StockClosing {
  id: number;
  closing_no: string;
  client_transaction_uuid: string;
  daily_session_id: number;
  /** Seen: SUBMITTED, CONFIRMED. */
  status: string;
  submitted_at: string | null;
  confirmed_at: string | null;
  notes: string | null;
  items: StockClosingItem[];
}

/** The salesman declares no amount: the server computes it. The SalesBuzz total is the typed string. */
export interface CreateCashClosingBody {
  daily_session_id: number;
  salesbuzz_invoice_total?: string;
  notes?: string;
}

/** `POST /api/daily-cash-closings` data (201). */
export interface CashClosing {
  id: number;
  closing_no: string;
  client_transaction_uuid: string;
  daily_session_id: number;
  status: string;
  system_expected_amount: Money;
  handheld_invoice_total: Money | null;
  salesbuzz_invoice_total: Money | null;
  source_variance_amount: Money | null;
  collected_cash_amount: Money;
  collected_cheque_amount: Money;
  collected_transfer_amount: Money;
  collected_card_amount: Money;
  expenses_amount: Money;
  tpp_amount: Money | null;
  shortage_amount: Money;
  excess_amount: Money;
  submitted_at: string | null;
}

export interface CreateHandoverBody {
  cash_closing_ids: number[];
  notes?: string;
}

/** `POST /api/treasury-handovers` data (201). */
export interface TreasuryHandover {
  id: number;
  handover_no: string;
  client_transaction_uuid: string;
  system_expected_amount: Money;
  status: string;
  submitted_at: string | null;
  items: { id: number; daily_cash_closing_id: number; amount: Money }[];
}
