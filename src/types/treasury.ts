import type { Money } from './common.js';

export type TreasuryDayStatus = 'OPEN' | 'COUNTED' | 'CLOSED';
export type RemittanceStatus = 'NOT_HANDED_OVER' | 'AWAITING_CONFIRMATION' | 'CONFIRMED';

/** Largest first — the order the cashier counts in (`BranchDailyTreasury::DENOMINATIONS`). */
export const TREASURY_DENOMINATIONS = ['200', '100', '50', '20', '10', '5', '1', '0.5'] as const;

/** `BranchDailyTreasuryController::present` */
export interface TreasuryDay {
  id: number;
  branch_id: number;
  business_date: string;
  status: TreasuryDayStatus;
  collected: { cash: Money; cheque: Money; transfer: Money; card: Money };
  deposits: { fridge_received: Money; fridge_refunded: Money; other: Money };
  expenses_amount: Money;
  net_cash_amount: Money;
  count: {
    /** Banknote counts keyed by denomination; `null` until counted. */
    denominations: Record<string, number> | null;
    /** `null` = not counted yet (different from counted and found 0.00). */
    counted_cash_amount: Money | null;
    variance_amount: Money;
    counted_by: string | null;
    counted_at: string | null;
  };
  remitted_to_bank_amount: Money;
  remittance: {
    status: RemittanceStatus;
    expected_amount: Money | null;
    remitted_amount: Money | null;
    remitted_by: string | null;
    remitted_at: string | null;
    received_amount: Money | null;
    variance_amount: Money | null;
    confirmed_by: string | null;
    confirmed_at: string | null;
    notes: string | null;
  };
  handover_count: number;
  pending_session_count: number;
  closed_by: string | null;
  closed_at: string | null;
  notes: string | null;
}

export interface TreasuryDailyQuery {
  business_date: string;
  branch_id?: number;
}

export interface TreasuryDailyResponse {
  success: true;
  data: TreasuryDay;
}
