import type { ErrorCode } from './generated/error-codes.js';

/** Codes produced on the client, never by the backend. */
export type ClientErrorCode = 'NETWORK' | 'INVALID_RESPONSE';

export type AnyErrorCode = ErrorCode | ClientErrorCode;

/** The one error shape every backend endpoint returns. */
export interface ErrorEnvelope {
  success: false;
  code: ErrorCode;
  message: string;
  message_ar: string;
  errors?: Record<string, string[]> | null;
  trace_id?: string | null;
}

interface ApiErrorInit {
  status: number;
  code: AnyErrorCode;
  message: string;
  messageAr: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string | null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: AnyErrorCode;
  readonly messageAr: string;
  readonly fieldErrors: Record<string, string[]>;
  readonly traceId: string | null;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.messageAr = init.messageAr;
    this.fieldErrors = init.fieldErrors ?? {};
    this.traceId = init.traceId ?? null;
  }

  static fromEnvelope(status: number, envelope: ErrorEnvelope): ApiError {
    return new ApiError({
      status,
      code: envelope.code,
      message: envelope.message,
      messageAr: envelope.message_ar,
      fieldErrors: envelope.errors ?? {},
      traceId: envelope.trace_id ?? null,
    });
  }

  static network(): ApiError {
    return new ApiError({
      status: 0,
      code: 'NETWORK',
      message: 'Could not reach the server.',
      messageAr: 'تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مرة أخرى.',
    });
  }

  static invalidResponse(status: number): ApiError {
    return new ApiError({
      status,
      code: 'INVALID_RESPONSE',
      message: 'Unexpected response from the server.',
      messageAr: 'استجابة غير متوقعة من الخادم.',
    });
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isErrorCode(error: unknown, code: AnyErrorCode): boolean {
  return isApiError(error) && error.code === code;
}

/** Admin called a branch-scoped endpoint without `branch_id` — a question, not a failure. */
export function isBranchRequired(error: unknown): boolean {
  return isErrorCode(error, 'AUTH_011');
}

export function isUnauthenticated(error: unknown): boolean {
  return isApiError(error) && (error.status === 401 || error.code === 'AUTH_007');
}

/** Missing permission or another branch's data. */
export function isForbidden(error: unknown): boolean {
  return isApiError(error) && error.status === 403;
}

/** Plain, serialisable description for UI (safe to pass from server to client components). */
export function describeError(error: unknown): { message: string; traceId: string | null } {
  if (isApiError(error)) {
    return { message: error.messageAr, traceId: error.traceId };
  }
  return { message: 'حدث خطأ غير متوقع.', traceId: null };
}
