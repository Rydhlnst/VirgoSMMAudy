import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function resolveTrustedOrigins(): string[] | undefined {
  const candidates = [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL];
  const origins = candidates
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (origins.length === 0) {
    return undefined;
  }

  return Array.from(new Set(origins));
}

export const auth = betterAuth({
  secret: getRequiredEnv("BETTER_AUTH_SECRET"),
  baseURL: getRequiredEnv("BETTER_AUTH_URL"),
  basePath: "/api/auth",
  trustedOrigins: resolveTrustedOrigins(),
  database: drizzleAdapter(getDb(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});
