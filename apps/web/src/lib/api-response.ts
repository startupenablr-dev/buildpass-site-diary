import { NextResponse } from 'next/server';
import type { NormalizedError, StandardErrorInput } from './errors';
import { normalizeError } from './errors';

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
};

export type ApiResponseInit = ResponseInit;

const defaultHeaders = {
  'Content-Type': 'application/json',
} as const;

function withDefaultHeaders(init?: ApiResponseInit): ApiResponseInit {
  if (!init?.headers) {
    return { ...init, headers: defaultHeaders };
  }

  return {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init.headers,
    },
  };
}

export function createSuccessResponse<T>(
  data: T,
  message = 'Success',
  init?: ApiResponseInit,
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  const status = init?.status ?? 200;

  return NextResponse.json(response, withDefaultHeaders({ ...init, status }));
}

export function createErrorResponseFrom(
  error: unknown,
  fallback: StandardErrorInput,
  init?: ApiResponseInit,
) {
  const normalized = normalizeError(error, fallback);

  return createErrorResponse(normalized, init);
}

export function createErrorResponse(
  error: NormalizedError | StandardErrorInput,
  init?: ApiResponseInit,
) {
  const status = 'status' in error ? (error.status ?? 500) : 500;
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, withDefaultHeaders({ ...init, status }));
}
