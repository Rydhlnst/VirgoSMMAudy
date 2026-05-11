import { z, ZodError } from "zod";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type SuccessOptions = {
  status?: number;
  message?: string;
};

export function successResponse<T>(data: T, options?: SuccessOptions): Response {
  const payload: ApiSuccess<T> = {
    success: true,
    data,
    ...(options?.message ? { message: options.message } : {}),
  };

  return Response.json(payload, { status: options?.status ?? 200 });
}

export function errorResponse(code: string, message: string, status = 500, details?: unknown): Response {
  const payload: ApiError = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };

  return Response.json(payload, { status });
}

export function validationErrorResponse(error: ZodError): Response {
  return errorResponse("VALIDATION_ERROR", "Validation error.", 400, z.treeifyError(error));
}

export function notFoundResponse(message = "Resource not found."): Response {
  return errorResponse("NOT_FOUND", message, 404);
}

export function unauthorizedResponse(): Response {
  return errorResponse("UNAUTHORIZED", "Unauthorized.", 401);
}

export function forbiddenResponse(): Response {
  return errorResponse("FORBIDDEN", "Forbidden.", 403);
}
