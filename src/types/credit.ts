import type { Money } from './common.js';

/** One open invoice from `GET /api/customers/{id}/receivables`. */
export interface Receivable {
  id: number;
  receivable_no: string;
  source: string;
  sale_id: number | null;
  original_amount: Money;
  paid_amount: Money;
  remaining_amount: Money;
  due_date: string | null;
  status: string;
}

export interface ReceivablesResponse {
  customer: { id: number; name: string };
  /** A JSON number (a sum), not a money string — the app does not display it. */
  outstanding_total: number;
  data: Receivable[];
}

export type CollectionMethod = 'CASH' | 'VISA' | 'CHEQUE' | 'BANK_TRANSFER';

/** `client_transaction_uuid` is added by `withTransactionUuid`. Amounts are the strings the user typed. */
export interface CreateCollectionBody {
  customer_visit_id: number;
  payment_method: CollectionMethod;
  allocations: { receivable_id: number; amount: string }[];
  cheque_no?: string;
  cheque_bank?: string;
  cheque_due_date?: string;
  transfer_reference?: string;
  notes?: string;
}

/** `POST /api/collections` data (201). The same uuid again returns this record. */
export interface Collection {
  id: number;
  collection_no: string;
  client_transaction_uuid: string;
  customer_id: number;
  amount: Money;
  payment_method: CollectionMethod;
  clearance_status: string;
  collected_at: string | null;
  allocations: { id: number; receivable_id: number; amount: Money }[];
}
