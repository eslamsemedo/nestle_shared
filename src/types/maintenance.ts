export interface NextService {
  due_on: string | null;
  days_left: number | null;
  due_at_km: number | null;
  km_remaining: number | null;
  overdue: boolean;
}

/** `GET /api/vehicles/maintenance/due` row. */
export interface VehicleServiceDue {
  vehicle_id: number;
  code: string;
  plate_number: string;
  reasons: string[];
  licence_expires_on: string | null;
  insurance_expires_on: string | null;
  next_service: NextService | null;
}

/** `GET /api/refrigerators/maintenance/due` row. */
export interface FridgeServiceDue {
  refrigerator_id: number;
  code: string;
  status: string;
  reasons: string[];
  next_service: NextService | null;
}

/** `GET /api/maintenance/faults` row. */
export interface MaintenanceFault {
  id: number;
  type: string;
  severity: string;
  business_date: string | null;
  message: string;
  status: string;
}

/** `GET /api/refrigerators` row (fields the field screens use). */
export interface Refrigerator {
  id: number;
  branch_id: number;
  code: string;
  type: string | null;
  model: string | null;
  capacity: string | null;
  status: string;
  is_active: boolean;
  notes: string | null;
  with_customer: { customer_id: number; customer: string; placed_on: string | null; deposit_amount: string | null } | null;
}

export type VehicleServiceType = 'SERVICE' | 'REPAIR' | 'OIL_CHANGE' | 'TYRES' | 'INSPECTION' | 'OTHER';
export type FridgeServiceType = 'SERVICE' | 'REPAIR' | 'GAS_REFILL' | 'CLEANING' | 'INSPECTION' | 'OTHER';

/** One spare part on a service. Quantities and costs are sent as typed (strings); the backend validates and totals. */
export interface ServicePartBody {
  part_name: string;
  quantity?: string;
  unit_cost?: string;
  notes?: string;
}

export interface CreateVehicleServiceBody {
  vehicle_id: number;
  type: VehicleServiceType;
  odometer_reading?: number;
  workshop?: string;
  document_no?: string;
  description?: string;
  notes?: string;
  expense_id?: number;
  next_service_due_on?: string;
  next_service_due_km?: number;
  parts?: ServicePartBody[];
}

export interface CreateFridgeServiceBody {
  refrigerator_id: number;
  type: FridgeServiceType;
  workshop?: string;
  document_no?: string;
  description?: string;
  restored_to_service?: boolean;
  notes?: string;
  expense_id?: number;
  next_service_due_on?: string;
  parts?: ServicePartBody[];
}

/** Create response `data` of both maintenance endpoints. */
export interface ServiceRecord {
  id: number;
  service_no: string;
  type: string;
  performed_on: string;
  parts_total: string;
}
