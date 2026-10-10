export interface VehicleRef {
  id: number;
  code: string;
  plate_number: string;
}

export type GateDirection = 'OUT' | 'IN';

/** `GET /api/gate/movements` row and `POST` response `data`. The server links the trip itself. */
export interface GateMovement {
  id: number;
  direction: GateDirection;
  business_date: string;
  occurred_at: string;
  vehicle: VehicleRef | null;
  route: string | null;
  driver: string | null;
  salesman: string | null;
  odometer_reading: number | null;
  refrigeration_ok: boolean | null;
  fuel_issued_litres: number | string | null;
  seal_no: string | null;
  notes: string | null;
  daily_session_id: number | null;
  recorded_by: string | null;
}

export interface CreateGateMovementBody {
  vehicle_id: number;
  direction: GateDirection;
  odometer_reading?: number;
  refrigeration_ok?: boolean;
  seal_no?: string;
  /** Sent as typed. */
  fuel_issued_litres?: string;
  notes?: string;
  /** Optional links; the backend reads the trip from the vehicle when they are absent. */
  daily_session_id?: number;
  driver_id?: number;
  salesman_id?: number;
  route_id?: number;
  business_date?: string;
  occurred_at?: string;
}

export type Shift = 'MORNING' | 'EVENING';

/** `GET /api/attendance` row and `POST` response `data`. */
export interface AttendanceRow {
  id: number;
  employee: string;
  employee_id?: number;
  business_date: string;
  shift: Shift | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  notes?: string | null;
}

export interface CreateAttendanceBody {
  employee_id: number;
  shift?: Shift;
  /** ISO time the officer saved the row; the server stores it only when sent. */
  checked_in_at?: string;
  /** Same rule for leaving: sent instead of `checked_in_at` when recording a check-out. */
  checked_out_at?: string;
  /** Defaults to the server's today. */
  business_date?: string;
  notes?: string;
}

export interface FuelVoucher {
  id: number;
  voucher_no: string;
  status: string;
  vehicle: VehicleRef | null;
  driver: string | null;
  issued_on: string | null;
  issued_by: string | null;
  litres: number | null;
  amount: string | null;
  station: string | null;
  redeemed_on: string | null;
  notes: string | null;
}

/** `GET /api/fuel-vouchers` `data`. */
export interface FuelVouchersData {
  branch_id: number;
  vouchers: FuelVoucher[];
}

export interface CreateFuelVoucherBody {
  voucher_no: string;
  vehicle_id: number;
  driver_id?: number;
  /** Defaults to today on the server. */
  issued_on?: string;
  notes?: string;
}
