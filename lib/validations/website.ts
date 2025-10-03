import { z } from "zod";

export const websiteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  screenshotUrl: z.string().url("Must be a valid URL"),
  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  fontIds: z.array(z.string()).optional(),
  colorIds: z.array(z.string()).optional(),
});

export type WebsiteInput = z.infer<typeof websiteSchema>;
