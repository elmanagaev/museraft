import { z } from "zod";

export const flowSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  screenshotUrls: z
    .array(z.string().url("Each screenshot must be a valid URL"))
    .min(1, "At least one screenshot is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export type FlowInput = z.infer<typeof flowSchema>;
