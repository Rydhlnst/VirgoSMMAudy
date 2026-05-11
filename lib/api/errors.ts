import { ZodError } from "zod";
import { errorResponse, validationErrorResponse } from "@/lib/api/response";

export class ApiRouteError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRouteError";
  }
}

export function isApiRouteError(error: unknown): error is ApiRouteError {
  return error instanceof ApiRouteError;
}

export function toErrorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (isApiRouteError(error)) {
    return errorResponse(error.code, error.message, error.status, error.details);
  }

  const message = error instanceof Error ? error.message : "Internal server error.";
  return errorResponse("INTERNAL_SERVER_ERROR", message, 500);
}
