/** The only endpoints that accept `client_transaction_uuid` — they write money or stock. */
export const TRANSACTION_ENDPOINTS = [
  '/api/sales',
  '/api/collections',
  '/api/customer-returns',
  '/api/customer-replacements',
  '/api/daily-cash-closings',
  '/api/daily-stock-closings',
  '/api/treasury-handovers',
  '/api/expenses',
] as const;

export type TransactionEndpoint = (typeof TRANSACTION_ENDPOINTS)[number];

export function isTransactionEndpoint(path: string): path is TransactionEndpoint {
  return (TRANSACTION_ENDPOINTS as readonly string[]).includes(path);
}

/**
 * Attaches the idempotency key. The caller generates `uuid` once, when the user taps save,
 * and passes the same value on every retry of that save.
 */
export function withTransactionUuid<B extends object>(
  path: string,
  body: B,
  uuid: string,
): B & { client_transaction_uuid: string } {
  if (!isTransactionEndpoint(path)) {
    throw new Error(`client_transaction_uuid is only allowed on the 8 money/stock endpoints, not ${path}`);
  }
  return { ...body, client_transaction_uuid: uuid };
}
