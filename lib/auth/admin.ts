import { auth } from "@/lib/auth";

type AdminCapableUser = {
  email?: string | null;
  role?: string | null;
};

type AdminCapableSession = {
  user?: AdminCapableUser | null;
} | null;

function getAdminEmailAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";

  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 0),
  );
}

export function isAdminUser(user: AdminCapableUser | null | undefined): boolean {
  if (!user) {
    return false;
  }

  const role = user.role?.trim().toLowerCase();
  if (role === "admin") {
    return true;
  }

  const email = user.email?.trim().toLowerCase();
  if (!email) {
    return false;
  }

  return getAdminEmailAllowlist().has(email);
}

export function isAdminSession(session: AdminCapableSession): boolean {
  if (!session?.user) {
    return false;
  }
  return isAdminUser(session.user);
}

export async function getAuthSession(requestHeaders: Headers) {
  return auth.api.getSession({
    headers: requestHeaders,
  });
}
