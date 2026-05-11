import { errorResponse, forbiddenResponse, unauthorizedResponse } from "@/lib/api/response";
import { getAuthSession, isAdminSession } from "@/lib/auth/admin";

type RequireAdminSuccess = {
  success: true;
  session: Awaited<ReturnType<typeof getAuthSession>>;
};

type RequireAdminFailure = {
  success: false;
  response: Response;
};

export type RequireAdminResult = RequireAdminSuccess | RequireAdminFailure;

export async function requireAdmin(request: Request): Promise<RequireAdminResult> {
  try {
    const session = await getAuthSession(request.headers);
    if (!session) {
      return { success: false, response: unauthorizedResponse() };
    }

    if (!isAdminSession(session)) {
      return { success: false, response: forbiddenResponse() };
    }

    return { success: true, session };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to validate admin session.";
    return {
      success: false,
      response: errorResponse("INTERNAL_SERVER_ERROR", message, 500),
    };
  }
}
