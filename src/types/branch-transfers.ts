/*
 * تحويلات بين الفروع — `BranchTransferService::present`.
 * REQUESTED → APPROVED → DISPATCHED → RECEIVED; REQUESTED may end REJECTED (admin) or CANCELLED (asking branch).
 */

export type BranchTransferStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'DISPATCHED' | 'RECEIVED' | 'CANCELLED';

export interface BranchTransferItem {
  product_id: number;
  product: string | null;
  code: string | null;
  requested_cartons: number;
  approved_cartons: number | null;
  dispatched_cartons: number | null;
  received_cartons: number | null;
  /** Dispatched − received; `null` until received. */
  short_cartons: number | null;
  /** Stock at the sending branch, for the admin and the sender only, while REQUESTED or APPROVED; else `null`. */
  available_at_source: number | null;
}

export interface BranchTransfer {
  id: number;
  transfer_no: string;
  status: BranchTransferStatus;
  /** Which end the caller's branch is; `null` for the admin. Drives which actions show. */
  my_side: 'from' | 'to' | null;
  from_branch: { id: number | null; code: string | null; name: string | null };
  to_branch: { id: number | null; code: string | null; name: string | null };
  /** Warehouse names, set on dispatch / receive. */
  from_warehouse: string | null;
  to_warehouse: string | null;
  items: BranchTransferItem[];
  requested_by: string | null;
  requested_at: string | null;
  decided_by: string | null;
  decided_at: string | null;
  decision_notes: string | null;
  dispatched_by: string | null;
  dispatched_at: string | null;
  received_by: string | null;
  received_at: string | null;
  notes: string | null;
}

export interface BranchTransfersQuery {
  status?: BranchTransferStatus;
  direction?: 'in' | 'out';
}

export interface CreateBranchTransferBody {
  /** The branch that sends. Own branch → `TRF_002`. */
  from_branch_id: number;
  /** Admin only; everyone else asks for their own branch. */
  to_branch_id?: number;
  items: { product_id: number; requested_cartons: number }[];
  notes?: string;
}

export interface DecideBranchTransferBody {
  decision: 'APPROVE' | 'REJECT';
  /** Omitted → approve what was asked. Never more than asked. */
  items?: { product_id: number; cartons: number }[];
  /** Required with REJECT. */
  notes?: string;
}

/** Dispatch and receive share this shape: omitted items default to approved / dispatched. */
export interface MoveBranchTransferBody {
  warehouse_id?: number;
  items?: { product_id: number; cartons: number }[];
}
