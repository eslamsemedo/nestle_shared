/** `GET /api/supply-requests` row (storekeeper reads SENT ones to receive against). */
export interface SupplyRequestItem {
  product_id: number;
  product: string;
  code: string;
  quantity_cartons: number;
}

export interface SupplyRequest {
  id: number;
  request_no: string;
  branch_id: number;
  supplier: string | null;
  warehouse: string | null;
  requested_for: string | null;
  status: string;
  sent_at: string | null;
  notes: string | null;
  items: SupplyRequestItem[];
}

export interface GoodsReceiptItem {
  product_id: number;
  product: string;
  code: string;
  ordered_cartons: number | null;
  received_cartons: number;
  variance: number | null;
}

/** `GET /api/goods-receipts` row and the create/confirm response `data`. */
export interface GoodsReceipt {
  id: number;
  receipt_no: string;
  delivery_note_no: string | null;
  branch_id: number;
  supply_request_id: number | null;
  warehouse: string | null;
  received_on: string;
  status: string;
  confirmed_at: string | null;
  items: GoodsReceiptItem[];
  has_variance: boolean;
}

/** `POST /api/goods-receipts` against a supply request (the server takes the warehouse from it). */
export interface CreateGoodsReceiptBody {
  supply_request_id: number;
  received_on: string;
  delivery_note_no?: string;
  items: { product_id: number; received_cartons: number }[];
  notes?: string;
}

export interface ColdRoomRef {
  id: number;
  code: string;
  name: string;
  min_celsius: string | null;
  max_celsius: string | null;
  monitored_only: boolean;
}

export interface ColdRoomReading {
  id: number;
  cold_room_id: number;
  business_date: string;
  reading_hour: number;
  /** JSON number; shown as sent. */
  celsius: number;
  out_of_range: boolean;
  recorded_by: string | null;
  recorded_at: string;
  notes: string | null;
}

export interface ColdRoomSheetRoom {
  cold_room: ColdRoomRef;
  readings: ColdRoomReading[];
  breaches: number;
  hours_not_read: number[];
}

/** `GET /api/cold-rooms/sheet?business_date=` `data`. */
export interface ColdRoomSheet {
  branch_id: number;
  business_date: string;
  rooms: ColdRoomSheetRoom[];
}

/** `POST /api/cold-rooms/readings`; `celsius` is sent as typed. */
export interface CreateColdRoomReadingBody {
  cold_room_id: number;
  reading_hour: number;
  celsius: string;
  notes?: string;
}
