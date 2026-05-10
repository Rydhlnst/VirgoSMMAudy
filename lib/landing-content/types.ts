import type { z } from "zod";
import { landingPageContentSchema } from "./schema";

export type LandingPageContentInput = z.input<typeof landingPageContentSchema>;
export type LandingPageContent = z.output<typeof landingPageContentSchema>;
