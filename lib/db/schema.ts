import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Enums
export const userRoleEnum = ["user", "admin"] as const;
export const subscriptionStatusEnum = ["free", "pro"] as const;
export const contentTypeEnum = [
  "website",
  "section",
  "dashboard",
  "flow",
] as const;

// Users Table
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: userRoleEnum }).notNull().default("user"),
  subscriptionStatus: text("subscription_status", {
    enum: subscriptionStatusEnum,
  })
    .notNull()
    .default("free"),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Websites Table
export const websites = sqliteTable("websites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
  websiteUrl: text("website_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Sections Table
export const sections = sqliteTable("sections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Dashboards Table
export const dashboards = sqliteTable("dashboards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Flows Table
export const flows = sqliteTable("flows", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  screenshotUrls: text("screenshot_urls", { mode: "json" })
    .notNull()
    .$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Categories Table
export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  type: text("type", { enum: contentTypeEnum }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Fonts Table
export const fonts = sqliteTable("fonts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Colors Table
export const colors = sqliteTable("colors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  hexCode: text("hex_code"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// LayoutTypes Table
export const layoutTypes = sqliteTable("layout_types", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Junction Tables

// WebsiteCategories
export const websiteCategories = sqliteTable("website_categories", {
  websiteId: text("website_id")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// WebsiteFonts
export const websiteFonts = sqliteTable("website_fonts", {
  websiteId: text("website_id")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  fontId: text("font_id")
    .notNull()
    .references(() => fonts.id, { onDelete: "cascade" }),
});

// WebsiteColors
export const websiteColors = sqliteTable("website_colors", {
  websiteId: text("website_id")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
});

// SectionCategories
export const sectionCategories = sqliteTable("section_categories", {
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// DashboardCategories
export const dashboardCategories = sqliteTable("dashboard_categories", {
  dashboardId: text("dashboard_id")
    .notNull()
    .references(() => dashboards.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// DashboardLayoutTypes
export const dashboardLayoutTypes = sqliteTable("dashboard_layout_types", {
  dashboardId: text("dashboard_id")
    .notNull()
    .references(() => dashboards.id, { onDelete: "cascade" }),
  layoutTypeId: text("layout_type_id")
    .notNull()
    .references(() => layoutTypes.id, { onDelete: "cascade" }),
});

// DashboardColors
export const dashboardColors = sqliteTable("dashboard_colors", {
  dashboardId: text("dashboard_id")
    .notNull()
    .references(() => dashboards.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
});

// FlowCategories
export const flowCategories = sqliteTable("flow_categories", {
  flowId: text("flow_id")
    .notNull()
    .references(() => flows.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
  sections: many(sections),
  dashboards: many(dashboards),
  flows: many(flows),
}));

export const websitesRelations = relations(websites, ({ one, many }) => ({
  creator: one(users, {
    fields: [websites.createdBy],
    references: [users.id],
  }),
  categories: many(websiteCategories),
  fonts: many(websiteFonts),
  colors: many(websiteColors),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  creator: one(users, {
    fields: [sections.createdBy],
    references: [users.id],
  }),
  categories: many(sectionCategories),
}));

export const dashboardsRelations = relations(dashboards, ({ one, many }) => ({
  creator: one(users, {
    fields: [dashboards.createdBy],
    references: [users.id],
  }),
  categories: many(dashboardCategories),
  layoutTypes: many(dashboardLayoutTypes),
  colors: many(dashboardColors),
}));

export const flowsRelations = relations(flows, ({ one, many }) => ({
  creator: one(users, {
    fields: [flows.createdBy],
    references: [users.id],
  }),
  categories: many(flowCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  websites: many(websiteCategories),
  sections: many(sectionCategories),
  dashboards: many(dashboardCategories),
  flows: many(flowCategories),
}));

export const fontsRelations = relations(fonts, ({ many }) => ({
  websites: many(websiteFonts),
}));

export const colorsRelations = relations(colors, ({ many }) => ({
  websites: many(websiteColors),
  dashboards: many(dashboardColors),
}));

export const layoutTypesRelations = relations(layoutTypes, ({ many }) => ({
  dashboards: many(dashboardLayoutTypes),
}));

// Junction table relations

export const websiteCategoriesRelations = relations(
  websiteCategories,
  ({ one }) => ({
    website: one(websites, {
      fields: [websiteCategories.websiteId],
      references: [websites.id],
    }),
    category: one(categories, {
      fields: [websiteCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const websiteFontsRelations = relations(websiteFonts, ({ one }) => ({
  website: one(websites, {
    fields: [websiteFonts.websiteId],
    references: [websites.id],
  }),
  font: one(fonts, {
    fields: [websiteFonts.fontId],
    references: [fonts.id],
  }),
}));

export const websiteColorsRelations = relations(websiteColors, ({ one }) => ({
  website: one(websites, {
    fields: [websiteColors.websiteId],
    references: [websites.id],
  }),
  color: one(colors, {
    fields: [websiteColors.colorId],
    references: [colors.id],
  }),
}));

export const sectionCategoriesRelations = relations(
  sectionCategories,
  ({ one }) => ({
    section: one(sections, {
      fields: [sectionCategories.sectionId],
      references: [sections.id],
    }),
    category: one(categories, {
      fields: [sectionCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const dashboardCategoriesRelations = relations(
  dashboardCategories,
  ({ one }) => ({
    dashboard: one(dashboards, {
      fields: [dashboardCategories.dashboardId],
      references: [dashboards.id],
    }),
    category: one(categories, {
      fields: [dashboardCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const dashboardLayoutTypesRelations = relations(
  dashboardLayoutTypes,
  ({ one }) => ({
    dashboard: one(dashboards, {
      fields: [dashboardLayoutTypes.dashboardId],
      references: [dashboards.id],
    }),
    layoutType: one(layoutTypes, {
      fields: [dashboardLayoutTypes.layoutTypeId],
      references: [layoutTypes.id],
    }),
  })
);

export const dashboardColorsRelations = relations(
  dashboardColors,
  ({ one }) => ({
    dashboard: one(dashboards, {
      fields: [dashboardColors.dashboardId],
      references: [dashboards.id],
    }),
    color: one(colors, {
      fields: [dashboardColors.colorId],
      references: [colors.id],
    }),
  })
);

export const flowCategoriesRelations = relations(flowCategories, ({ one }) => ({
  flow: one(flows, {
    fields: [flowCategories.flowId],
    references: [flows.id],
  }),
  category: one(categories, {
    fields: [flowCategories.categoryId],
    references: [categories.id],
  }),
}));

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type Dashboard = typeof dashboards.$inferSelect;
export type NewDashboard = typeof dashboards.$inferInsert;
export type Flow = typeof flows.$inferSelect;
export type NewFlow = typeof flows.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Font = typeof fonts.$inferSelect;
export type NewFont = typeof fonts.$inferInsert;
export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;
export type LayoutType = typeof layoutTypes.$inferSelect;
export type NewLayoutType = typeof layoutTypes.$inferInsert;
