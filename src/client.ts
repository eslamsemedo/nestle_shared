import { ApiError, type ErrorEnvelope } from './errors.js';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

export interface ApiClientOptions {
  /** `http://localhost:8000`, the production URL, or `/api/proxy` in the dashboard browser. */
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  /** Called on any 401 before the error is thrown. */
  onUnauthorized?: () => void;
  fetch?: typeof fetch;
}

export interface RequestOptions {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiClient {
  request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  post<T>(path: string, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, options?: RequestOptions): Promise<T>;
  put<T>(path: string, options?: RequestOptions): Promise<T>;
  del<T>(path: string, options?: RequestOptions): Promise<T>;
  upload<T>(path: string, form: FormData, options?: Omit<RequestOptions, 'body'>): Promise<T>;
}

function buildUrl(baseUrl: string, path: string, query?: Query): string {
  const base = baseUrl.replace(/\/+$/, '');
  const params: string[] = [];
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined || value === '') continue;
    // Laravel's `boolean` rule accepts 1/0 but not the strings "true"/"false".
    const text = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(text)}`);
  }
  return params.length > 0 ? `${base}${path}?${params.join('&')}` : `${base}${path}`;
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { success?: unknown }).success === false &&
    typeof (value as { code?: unknown }).code === 'string'
  );
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  async function request<T>(method: HttpMethod, path: string, init: RequestOptions = {}): Promise<T> {
    const doFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    const token = options.getToken ? await options.getToken() : null;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      // Alert messages and validation messages are rendered in the request locale.
      'Accept-Language': 'ar',
      ...init.headers,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    let body: BodyInit | undefined;
    if (init.body instanceof FormData) {
      // The runtime sets the multipart boundary itself.
      body = init.body;
    } else if (init.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(init.body);
    }

    let response: Response;
    try {
      response = await doFetch(buildUrl(options.baseUrl, path, init.query), {
        method,
        headers,
        body,
        signal: init.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      throw ApiError.network();
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    let json: unknown;
    try {
      json = text.length > 0 ? JSON.parse(text) : undefined;
    } catch {
      throw ApiError.invalidResponse(response.status);
    }

    if (!response.ok) {
      if (response.status === 401) options.onUnauthorized?.();
      if (isErrorEnvelope(json)) throw ApiError.fromEnvelope(response.status, json);
      throw ApiError.invalidResponse(response.status);
    }

    return json as T;
  }

  return {
    request,
    get: <T>(path: string, opts?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, opts),
    post: <T>(path: string, opts?: RequestOptions) => request<T>('POST', path, opts),
    patch: <T>(path: string, opts?: RequestOptions) => request<T>('PATCH', path, opts),
    put: <T>(path: string, opts?: RequestOptions) => request<T>('PUT', path, opts),
    del: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
    upload: <T>(path: string, form: FormData, opts?: Omit<RequestOptions, 'body'>) =>
      request<T>('POST', path, { ...opts, body: form }),
  };
}
