import { z } from "zod";

export const dashboardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  screenshotUrl: z.string().url("Must be a valid URL"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  layoutTypeIds: z.array(z.string()).optional(),
  colorIds: z.array(z.string()).optional(),
});

export type DashboardInput = z.infer<typeof dashboardSchema>;
