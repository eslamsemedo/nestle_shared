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
