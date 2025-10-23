import { GraphQLError } from 'graphql';

const DEFAULT_MASKED_ERROR_MESSAGE =
  'Something went wrong. Please try again later.';

export type StandardErrorInput = {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
};

export type NormalizedError = {
  code: string;
  message: string;
  status: number;
  details?: unknown;
};

export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor({ code, message, status = 500, details }: StandardErrorInput) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;

export function normalizeError(
  error: unknown,
  fallback: StandardErrorInput,
): NormalizedError {
  const baseStatus = fallback.status ?? 500;

  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      ...(error.details !== undefined ? { details: error.details } : {}),
    };
  }

  if (error instanceof Error) {
    return {
      code: fallback.code,
      message: error.message || fallback.message,
      status: baseStatus,
      ...(fallback.details !== undefined ? { details: fallback.details } : {}),
    };
  }

  return {
    code: fallback.code,
    message: fallback.message,
    status: baseStatus,
    ...(fallback.details !== undefined ? { details: fallback.details } : {}),
  };
}

export type GraphQLErrorOptions = {
  code?: string;
  status?: number;
  details?: unknown;
};

export function createGraphQLError(
  message: string,
  {
    code = 'INTERNAL_SERVER_ERROR',
    status = 500,
    details,
  }: GraphQLErrorOptions = {},
): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      success: false,
      code,
      http: { status },
      timestamp: new Date().toISOString(),
      clientSafe: true,
      ...(details !== undefined ? { details } : {}),
    },
  });
}

export function graphQLErrorFrom(
  error: unknown,
  fallback: StandardErrorInput,
): GraphQLError {
  const normalized = normalizeError(error, fallback);

  return createGraphQLError(normalized.message, {
    code: normalized.code,
    status: normalized.status,
    details: normalized.details,
  });
}

type GraphQLErrorExtensions = {
  success?: unknown;
  code?: unknown;
  clientSafe?: unknown;
  http?: unknown;
  timestamp?: unknown;
  details?: unknown;
};

const SAFE_EXTENSION_KEYS = new Set([
  'success',
  'code',
  'clientSafe',
  'http',
  'timestamp',
  'details',
]);

function extractStatus(extensions: GraphQLErrorExtensions): number | undefined {
  const httpExtension = extensions.http;

  if (!httpExtension || typeof httpExtension !== 'object') {
    return undefined;
  }

  const status = (httpExtension as { status?: unknown }).status;

  return typeof status === 'number' ? status : undefined;
}

function isClientSafeExtension(extensions: GraphQLErrorExtensions): boolean {
  if (!extensions) {
    return false;
  }

  if (extensions.clientSafe === true) {
    return true;
  }

  return extensions.success === false && typeof extensions.code === 'string';
}

function pickSafeExtensions(
  extensions: GraphQLErrorExtensions,
): Record<string, unknown> {
  const safeExtensions: Record<string, unknown> = {};

  for (const key of Object.keys(extensions)) {
    if (!SAFE_EXTENSION_KEYS.has(key)) {
      continue;
    }

    const value = extensions[key as keyof GraphQLErrorExtensions];

    if (value === undefined) {
      continue;
    }

    if (key === 'http') {
      const status = extractStatus(extensions);

      if (status !== undefined) {
        safeExtensions.http = { status };
      }

      continue;
    }

    safeExtensions[key] = value;
  }

  safeExtensions.clientSafe = true;

  if (safeExtensions.timestamp === undefined) {
    safeExtensions.timestamp = new Date().toISOString();
  }

  if (safeExtensions.success === undefined) {
    safeExtensions.success = false;
  }

  return safeExtensions;
}

function ensureGraphQLError(error: unknown): GraphQLError {
  if (error instanceof GraphQLError) {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === 'string' && message.length > 0) {
      return new GraphQLError(message);
    }
  }

  return new GraphQLError(DEFAULT_MASKED_ERROR_MESSAGE);
}

export function maskGraphQLError(error: unknown, isDev: boolean): GraphQLError {
  const graphQLError = ensureGraphQLError(error);

  if (isDev) {
    return graphQLError;
  }

  const extensions = (graphQLError.extensions ?? {}) as GraphQLErrorExtensions;

  if (isClientSafeExtension(extensions)) {
    return new GraphQLError(graphQLError.message, {
      nodes: graphQLError.nodes,
      source: graphQLError.source,
      positions: graphQLError.positions,
      path: graphQLError.path,
      extensions: pickSafeExtensions(extensions),
    });
  }

  return new GraphQLError(DEFAULT_MASKED_ERROR_MESSAGE, {
    nodes: graphQLError.nodes,
    source: graphQLError.source,
    positions: graphQLError.positions,
    path: graphQLError.path,
    extensions: {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      clientSafe: true,
      http: { status: 500 },
      timestamp: new Date().toISOString(),
    },
  });
}
