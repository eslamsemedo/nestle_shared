import type { StockProductRef } from './stock.js';

export type ReturnReason = 'EXPIRED' | 'DAMAGED' | 'CUSTOMER_REFUSAL' | 'OTHER';
export type ReturnAction = 'RETURN' | 'REPLACEMENT';

export interface CreateReturnBody {
  customer_visit_id: number;
  reason: ReturnReason;
  requested_action: ReturnAction;
  items: { product_id: number; quantity_cartons: number }[];
  notes?: string;
}

/** `POST /api/customer-returns` data (201). */
export interface CustomerReturn {
  id: number;
  return_no: string;
  customer_id: number;
  reason: ReturnReason;
  requested_action: ReturnAction;
  status: string;
  returned_at: string | null;
  items: { id: number; product_id: number; quantity_cartons: number; product?: StockProductRef | null }[];
}

export interface CreateReplacementBody {
  customer_return_id: number;
  notes?: string;
}

export interface ReplacementItem {
  id: number;
  product_id: number;
  required_quantity_cartons: number;
  delivered_quantity_cartons: number;
  warehouse_issued_quantity_cartons: number;
  fulfillment_source: string;
  /** Seen: READY_FROM_SALESMAN_STOCK, PENDING_WAREHOUSE, WAREHOUSE_RESERVED, WITH_SALESMAN, DELIVERED. */
  status: string;
}

/** Data of `POST /api/customer-replacements` and its deliver/confirm actions. */
export interface CustomerReplacement {
  id: number;
  replacement_no: string;
  customer_return_id: number;
  customer_id: number;
  /** Seen: OPEN, COMPLETED. */
  status: string;
  completed_at: string | null;
  items: ReplacementItem[];
}
