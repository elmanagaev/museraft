# Marketing Screenshot Showcase - Architecture Document

## Project Overview

A curated gallery for marketing website screenshots with tiered access (free/pro), powerful filtering, and comprehensive admin panel.

## Technology Stack

### Core

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (development) → Supabase PostgreSQL (production)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod
- **UI Components**: shadcn/ui

### Additional Libraries

- **bcryptjs**: Password hashing
- **react-hook-form**: Form management
- **@tanstack/react-query**: Server state management
- **date-fns**: Date utilities
- **lucide-react**: Icons

## Database Schema

### Users Table

```typescript
{
  id: uuid (primary key)
  email: string (unique, indexed)
  password: string (hashed)
  name: string
  role: enum ['user', 'admin']
  subscriptionStatus: enum ['free', 'pro']
  emailVerified: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Websites Table

```typescript
{
  id: uuid (primary key)
  title: string
  description: text
  screenshotUrl: string
  websiteUrl: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
  createdBy: uuid (foreign key → users.id)
}
```

### Sections Table

```typescript
{
  id: uuid (primary key)
  title: string
  description: text
  screenshotUrl: string
  createdAt: timestamp
  updatedAt: timestamp
  createdBy: uuid (foreign key → users.id)
}
```

### Dashboards Table

```typescript
{
  id: uuid (primary key)
  title: string
  description: text
  screenshotUrl: string
  createdAt: timestamp
  updatedAt: timestamp
  createdBy: uuid (foreign key → users.id)
}
```

### Flows Table

```typescript
{
  id: uuid (primary key)
  title: string
  description: text
  screenshotUrls: json (array of strings)
  createdAt: timestamp
  updatedAt: timestamp
  createdBy: uuid (foreign key → users.id)
}
```

### Categories Table

```typescript
{
  id: uuid (primary key)
  name: string (unique)
  type: enum ['website', 'section', 'dashboard', 'flow']
  createdAt: timestamp
}
```

### Fonts Table

```typescript
{
  id: uuid (primary key)
  name: string (unique)
  createdAt: timestamp
}
```

### Colors Table

```typescript
{
  id: uuid (primary key)
  name: string
  hexCode: string (optional)
  createdAt: timestamp
}
```

### LayoutTypes Table

```typescript
{
  id: uuid (primary key)
  name: string (unique)
  createdAt: timestamp
}
```

### Junction Tables (Many-to-Many Relationships)

#### WebsiteCategories

```typescript
{
  websiteId: uuid (foreign key)
  categoryId: uuid (foreign key)
  primary key: (websiteId, categoryId)
}
```

#### WebsiteFonts

```typescript
{
  websiteId: uuid (foreign key)
  fontId: uuid (foreign key)
  primary key: (websiteId, fontId)
}
```

#### WebsiteColors

```typescript
{
  websiteId: uuid (foreign key)
  colorId: uuid (foreign key)
  primary key: (websiteId, colorId)
}
```

#### SectionCategories

```typescript
{
  sectionId: uuid (foreign key)
  categoryId: uuid (foreign key)
  primary key: (sectionId, categoryId)
}
```

#### DashboardCategories

```typescript
{
  dashboardId: uuid (foreign key)
  categoryId: uuid (foreign key)
  primary key: (dashboardId, categoryId)
}
```

#### DashboardLayoutTypes

```typescript
{
  dashboardId: uuid (foreign key)
  layoutTypeId: uuid (foreign key)
  primary key: (dashboardId, layoutTypeId)
}
```

#### DashboardColors

```typescript
{
  dashboardId: uuid (foreign key)
  colorId: uuid (foreign key)
  primary key: (dashboardId, colorId)
}
```

#### FlowCategories

```typescript
{
  flowId: uuid (foreign key)
  categoryId: uuid (foreign key)
  primary key: (flowId, categoryId)
}
```

## Folder Structure

```
c:/Sites/museraft/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── websites/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── sections/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── dashboards/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── flows/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── tags/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── websites/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── sections/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── dashboards/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── flows/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── admin/
│   │       ├── users/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── tags/
│   │           └── route.ts
│   ├── websites/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── sections/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── dashboards/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── flows/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── page.tsx (Home with unified filtering)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── reset-password-form.tsx
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── website-form.tsx
│   │   ├── section-form.tsx
│   │   ├── dashboard-form.tsx
│   │   ├── flow-form.tsx
│   │   ├── user-table.tsx
│   │   └── tag-manager.tsx
│   ├── filters/
│   │   ├── filter-sidebar.tsx
│   │   ├── category-filter.tsx
│   │   ├── font-filter.tsx
│   │   ├── color-filter.tsx
│   │   └── layout-filter.tsx
│   ├── gallery/
│   │   ├── screenshot-card.tsx
│   │   ├── screenshot-grid.tsx
│   │   └── pagination.tsx
│   ├── subscription/
│   │   ├── upgrade-dialog.tsx
│   │   └── subscription-badge.tsx
│   └── navigation/
│       ├── header.tsx
│       └── footer.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── auth/
│   │   ├── config.ts
│   │   └── utils.ts
│   ├── validations/
│   │   ├── auth.ts
│   │   ├── website.ts
│   │   ├── section.ts
│   │   ├── dashboard.ts
│   │   └── flow.ts
│   ├── utils.ts
│   └── constants.ts
├── middleware.ts (Auth + subscription checks)
├── drizzle.config.ts
└── ARCHITECTURE.md
```

## Key Features Implementation

### 1. Authentication Flow

- **NextAuth.js v5** with credentials provider
- Password hashing with bcryptjs
- Session-based authentication
- Role-based middleware protection
- Future: Email verification integration point

### 2. Subscription Logic

- **Free users**: Access pages 1-3
- **Pro users**: Unlimited access
- **Upgrade Dialog**: Appears on page 3 for free users
- Middleware checks subscription status
- Future: Paddle Billing integration layer

### 3. Filtering System

- Multi-select filters for:
  - Categories (across all content types)
  - Fonts (websites)
  - Colors (websites, dashboards)
  - Layout types (dashboards)
- Real-time filtering with URL state
- Combined filtering across all four sections
- Performant query optimization

### 4. Admin Panel

- Protected routes (admin role required)
- CRUD operations for all content types
- Tag/attribute management
- User management (view, edit roles, subscription)
- Clean, intuitive dashboard UI

### 5. Pagination Strategy

- Server-side pagination
- 12 items per page (adjustable)
- Page numbers + next/prev navigation
- Subscription gate on page 3 for free users

## API Routes Design

### Public Routes

- `GET /api/websites?page=1&category=saas&font=inter`
- `GET /api/sections?page=1&category=hero`
- `GET /api/dashboards?page=1&category=analytics&layout=grid`
- `GET /api/flows?page=1&category=onboarding`

### Protected Routes (Admin Only)

- `POST /api/websites` - Create
- `PUT /api/websites/[id]` - Update
- `DELETE /api/websites/[id]` - Delete
- Similar for sections, dashboards, flows
- `GET/POST/PUT/DELETE /api/admin/users/[id]`
- `GET/POST/PUT/DELETE /api/admin/tags`

### Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Migration Path to Supabase

### Drizzle Schema Considerations

- Use PostgreSQL-compatible types from the start
- Use `text` over `string` where appropriate
- Use `jsonb` instead of `json` for better performance
- Use `uuid` with proper generation
- Timestamp with timezone support

### Migration Steps

1. Export data from SQLite
2. Update drizzle.config.ts for PostgreSQL
3. Run migrations on Supabase
4. Import data
5. Update connection string
6. Minimal code changes (thanks to Drizzle abstraction)

## Security Considerations

- All passwords hashed with bcryptjs (10 rounds)
- CSRF protection via NextAuth.js
- Input validation with Zod
- SQL injection prevention (Drizzle parameterization)
- Role-based access control
- Rate limiting on sensitive endpoints (future)

## Performance Optimizations

- Server Components for initial data fetching
- Client Components only for interactive elements
- Image optimization with Next.js Image
- Database indexing on frequently queried fields
- Pagination to limit data transfer
- React Query for client-side caching

## Testing Strategy

- Unit tests for validation schemas
- Integration tests for API routes
- E2E tests for critical user flows
- Manual testing checklist

## Deployment Considerations

- Environment variables for sensitive data
- Database connection pooling
- Error logging and monitoring
- Backup strategy for SQLite → PostgreSQL
- CI/CD pipeline setup

## Future Enhancements

- Email verification system
- Paddle Billing integration
- Search functionality
- Favorites/bookmarks feature
- User profiles
- Social sharing
- Analytics dashboard
- Export functionality
- Dark mode
