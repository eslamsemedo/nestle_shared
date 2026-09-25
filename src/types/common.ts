/** Money always arrives as a string with two decimals, e.g. "1500.00" or "-25.50". */
export type Money = string;

export interface ListResponse<T> {
  success: true;
  data: T[];
}

export interface ItemResponse<T> {
  success: true;
  data: T;
}

/** Lists that answer `{ data: [...] }` without `success` (e.g. `/api/my/salesman-stock-requests`). */
export interface BareListResponse<T> {
  data: T[];
}

/** Writes that answer `{ message, data }` without `success` (e.g. stock requests, start-route). */
export interface MessageResponse<T> {
  message: string;
  data: T;
}
