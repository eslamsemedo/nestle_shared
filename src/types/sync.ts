/** `POST /api/sync/push` — the day worked without signal (§2.18). Always 200; every action reports its own outcome. */
export type SyncActionType = 'visit.start' | 'visit.complete' | 'sale' | 'collection' | 'expense';

export interface SyncAction {
  type: SyncActionType;
  /** The same body the online endpoint takes (sale/collection include `client_transaction_uuid`). */
  payload: object;
}

export interface SyncPushBody {
  actions: SyncAction[];
}

export interface SyncResult {
  index: number;
  type: string;
  client_transaction_uuid: string | null;
  accepted: boolean;
  /** When accepted: the created record's id (the original one on a replay). */
  id?: number | null;
  /** When refused. */
  code?: string;
  field?: string | null;
  /** One message in the request locale (the client sends `Accept-Language: ar`); there is no `message_ar` here. */
  message?: string;
}

export interface SyncPushResponse {
  success: true;
  message: string;
  data: { accepted: number; rejected: number; results: SyncResult[] };
}
