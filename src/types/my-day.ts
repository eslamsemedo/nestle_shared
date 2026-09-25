import type { Money } from './common.js';

/** Trip statuses written by the backend services (`DailySalesmanSession.status`). */
export type TripStatus = 'preparing' | 'on_route' | 'returned' | 'stock_closed' | 'closed' | 'cancelled';

/** `MobileDayService::presentTrip` */
export interface MyDayTrip {
  id: number;
  session_no: string;
  business_date: string;
  trip_no: number;
  status: TripStatus;
  branch: { id: number; code: string; name: string };
  route: { id: number; code: string; name: string } | null;
  vehicle: { id: number; code: string; plate_number: string } | null;
  driver: string | null;
  started_at: string | null;
  route_started_at: string | null;
}

/** Credit is read from the parent account when the customer is a branch of another. */
export interface CustomerCredit {
  account_customer_id: number;
  /** `null` = no limit set (different from "0.00"). */
  limit: Money | null;
  outstanding: Money;
  available: Money | null;
  days: number | null;
}

/** `MobileDayService::customerPayload` + `visit_order` */
export interface MyDayCustomer {
  id: number;
  customer_code: string;
  salesbuzz_code: string | null;
  name: string;
  phone: string | null;
  address: string | null;
  area: string | null;
  channel: string | null;
  customer_type: string | null;
  latitude: number | null;
  longitude: number | null;
  /** JSON numbers, shown as sent. */
  discount_rate: number;
  payment_terms: string | null;
  tax_rate: number;
  credit: CustomerCredit;
  visit_order: number;
}

/** `MobileDayService::catalogue` — priced for the trip's business date. */
export interface MyDayProduct {
  id: number;
  code: string;
  name: string;
  category: string | null;
  barcode: string | null;
  salesbuzz_code: string | null;
  /** 0 until the storekeeper sets the pack size (selling by the piece is refused until then). */
  units_per_carton: number;
  /** `null` when the product has no active price; then `sellable` is false. */
  price: Money | null;
  sellable: boolean;
}

/** `MobileDayService::vehicleStock` — only lines with quantity > 0. */
export interface VehicleStockLine {
  product_id: number;
  product_code: string | null;
  product_name: string | null;
  quantity_cartons: number;
}

export interface ExpenseCategoryOption {
  id: number;
  code: string;
  name: string;
  name_ar: string;
  requires_vehicle: boolean;
  requires_odometer: boolean;
}

/** `GET /api/my/day` — everything the salesman needs for the day. */
export interface MyDay {
  synced_at: string;
  employee: { id: number; name: string; employee_code: string; position_code: string; branch_id: number };
  /** `null` = no open trip; a valid, empty day. */
  trip: MyDayTrip | null;
  customers: MyDayCustomer[];
  products: MyDayProduct[];
  vehicle_stock: VehicleStockLine[];
  expense_categories: ExpenseCategoryOption[];
  capabilities: string[];
}

export interface MyDayResponse {
  success: true;
  data: MyDay;
}
