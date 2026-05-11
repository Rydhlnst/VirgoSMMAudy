import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuthSession, isAdminSession } from "@/lib/auth/admin";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getAuthSession(req.headers);
      if (!isAdminSession(session)) {
        throw new UploadThingError("Unauthorized upload request.");
      }
      const adminSession = session as NonNullable<typeof session>;

      return {
        role: "admin" as const,
        userId: adminSession.user.id,
      };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        key: file.key,
        name: file.name,
        size: file.size,
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
