export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED';

/** `AlertController::present` */
export interface Alert {
  id: number;
  branch_id: number | null;
  type: string;
  severity: AlertSeverity;
  business_date: string | null;
  /** Rendered in the request locale (`Accept-Language: ar`). */
  message: string;
  subject: { type: string; id: number } | null;
  status: AlertStatus;
  acknowledged_by: string | null;
  /** `Y-m-d H:i:s`, not ISO. */
  acknowledged_at: string | null;
  notes: string | null;
}

export interface AlertsQuery {
  business_date?: string;
  status?: AlertStatus;
  severity?: AlertSeverity;
}

export interface AlertsResponse {
  success: true;
  data: Alert[];
  summary: { open: number; critical: number };
}
