// Pagination
export const ITEMS_PER_PAGE = 12;
export const FREE_USER_MAX_PAGE = 3;

// Content types
export const CONTENT_TYPES = {
  WEBSITE: "website",
  SECTION: "section",
  DASHBOARD: "dashboard",
  FLOW: "flow",
} as const;

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

// Subscription status
export const SUBSCRIPTION_STATUS = {
  FREE: "free",
  PRO: "pro",
} as const;

// Default categories by type
export const DEFAULT_CATEGORIES = {
  website: ["SaaS", "E-commerce", "Portfolio", "Agency", "Fintech"],
  section: ["Hero", "CTA", "About", "Pricing", "Testimonials", "Features"],
  dashboard: ["Analytics", "Admin", "Project Management", "CRM", "E-commerce"],
  flow: ["Onboarding", "Checkout", "Authentication", "Upgrade", "Settings"],
};

// Default fonts
export const DEFAULT_FONTS = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto",
  "Open Sans",
  "Lato",
  "system-ui",
];

// Default colors
export const DEFAULT_COLORS = [
  { name: "Blue", hexCode: "#3B82F6" },
  { name: "Green", hexCode: "#10B981" },
  { name: "Red", hexCode: "#EF4444" },
  { name: "Purple", hexCode: "#8B5CF6" },
  { name: "Orange", hexCode: "#F59E0B" },
  { name: "Pink", hexCode: "#EC4899" },
  { name: "Monochromatic", hexCode: null },
];

// Default layout types
export const DEFAULT_LAYOUT_TYPES = [
  "Grid",
  "Sidebar",
  "Tabbed",
  "Card-based",
  "Minimal",
  "Dashboard",
];
