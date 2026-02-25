# React Vite MUI Boilerplate

Boilerplate React + TypeScript + Vite with modular **Clean Architecture** (pragmatic frontend adaptation), MUI, TanStack Query, React Router 7 and team conventions.

---

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build
```

---

## Tech Stack

| Library                   | Purpose                  |
| ------------------------- | ------------------------ |
| React 19                  | UI framework             |
| Vite 7                    | Build tool               |
| TypeScript 5.9            | Type safety              |
| MUI 7 (Material UI)       | Design system            |
| Tailwind CSS 4            | Utility CSS              |
| React Router 7            | Routing                  |
| TanStack Query 5          | Data fetching & cache    |
| React Hook Form 7 + Zod 4 | Form validation          |
| Zustand 5                 | State management         |
| Axios                     | HTTP client              |
| MSW 2                     | Mock API (dev/test)      |
| Vitest 4                  | Unit/integration testing |

---

## Architecture Overview

This project applies **Clean Architecture** adapted for frontend reality. The key difference from Uncle Bob's original:

> **Frontend does not own the domain.** Backend is source of truth. Frontend is a **projection** of domain onto UI.

### Layer Classification

```
🔴 Infrastructure    @core/, @themes/, shared/
                     Axios, React, MUI, Zustand, OpenAPI contract

🟡 Interface Adapters
   ├── Gateway       _api/*.api.ts        HTTP calls (uses axiosInstance)
   ├── Hooks         hooks/use*.ts        React Query wrappers around use cases
   ├── Pages         pages/*.tsx          Page containers (state + composition)
   ├── Components    components/*.tsx     UI presentation
   ├── Modals        modals/*.tsx         Dialog components
   └── Routes        _routes/             Route config with metadata

🟢 Use Cases         _usecases/
                     Pure async functions: validate → map → call API → map response
                     Validation schemas (Zod), data mappers, orchestration logic

🔵 Domain            _domain/
                     Business rules, constants, domain functions
                     UI-specific types not in API contract (filters, computed models)

📋 Shared Contract   _api/*.type.ts
                     DTO type definitions from OpenAPI (compile-time only, zero runtime)
                     Can be imported by ANY layer — they are erased after compile
```

### The Golden Rule

```
Dependencies point INWARD only:

🔴 Infrastructure → 🟡 Adapters → 🟢 Use Cases → 🔵 Domain
                                                 ↗
                              📋 Shared Contract ─┘ (type-only, any layer can import)
```

### Pragmatic Decisions

| Decision                                                            | Rationale                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Use cases depend on **Port** (interface); Gateway implements it     | Keeps Dependency Rule: Use Case → Port (inner); Gateway → Port (inward). Adapter injects gateway when calling use case |
| `_api/*.type.ts` treated as shared contract, not owned by any layer | They are `import type` only — erased at compile time, create no runtime coupling      |
| Domain model = DTO when shapes match (`type RoleItem = Role`)       | No duplicate types; create separate domain model only when computed fields are needed |
| Domain model ≠ DTO when UI needs computed properties                | e.g. `Employee.fullName`, `Employee.displayStatus` — mapper does real transformation  |

---

## Project Structure

```
src/
├── @core/                        🔴 Infrastructure
│   ├── __mocks__/                MSW handlers (dev/test)
│   ├── api-contract/             OpenAPI generated types
│   ├── app-shell/                Layout, drawer, header, menu
│   ├── axios/                    HTTP client config
│   ├── constants/                App-level constants
│   ├── errors/                   Error pages (401, 404, 500)
│   ├── guards/                   Route guards (AuthGuard)
│   ├── middlewares/              Route middlewares
│   ├── modal/                    Modal engine (registry pattern)
│   └── providers/                Root providers (theme, query, auth)
│
├── @themes/                      🔴 Design System
│   ├── _customize/               Theme customization
│   ├── colors/                   Color palettes (light/dark)
│   ├── overrides/                MUI component overrides
│   └── providers/                Theme provider
│
├── modules/                      Feature Modules
│   ├── auth/                     Authentication
│   ├── dashboard/                Dashboard & analytics
│   ├── employees/                Employee management (HRM)
│   ├── organizations/            Org unit management
│   ├── roles_permissions/        Roles & permissions (RBAC)
│   ├── settings/                 App settings
│   └── users/                    User management
│
├── routes/                       🟡 Top-level Routing
│   ├── privateRoute.tsx          Protected routes (aggregates modules)
│   ├── publicRoute.tsx           Public routes
│   └── wildcardRoute.tsx         404 fallback
│
├── shared/                       🔴 Reusable Primitives
│   ├── apis/                     Shared API hooks (auth, orgUnits)
│   ├── components/               UI atoms (forms, table, charts, select)
│   ├── hooks/                    Generic hooks (useDebounce)
│   ├── permissions/              Permission check utilities
│   ├── types/                    Shared types (pagination, route)
│   ├── utils/                    Pure utilities
│   └── validations/              Shared validation schemas
│
├── App.tsx
├── AppRouter.tsx
└── main.tsx
```

---

## Module Structure

Each feature module follows this convention:

```
modules/<feature>/
├── _domain/                      🔵 Domain Layer
│   ├── <feature>.rules.ts        Business rules, constants, domain functions
│   └── <feature>.model.ts        UI-specific types (filters, computed models)
│                                  Only needed when DTO shape is insufficient
│
├── _api/                         🟡 Gateway + 📋 Contract
│   ├── <feature>.api.ts          HTTP calls (axiosInstance)
│   └── <feature>.type.ts         DTOs from OpenAPI (type-only, shared contract)
│
├── _usecases/                    🟢 Use Cases (organized by action)
│   ├── <feature>.port.ts             Port (interface) — Gateway implements this
│   └── <action>/
│       ├── <action>.validation.ts    Zod schemas (references domain rules)
│       ├── <action>.mapper.ts        DTO ↔ Domain transformations
│       └── <action>.usecase.ts       Orchestration: validate → map → call port → map (port injected by adapter)
│
├── _routes/                      🟡 Route config with metadata
│   ├── index.tsx
│   └── path.ts
│
└── <sub-feature>/                🟡 Adapter Layer (UI slice)
    ├── _routes/
    ├── hooks/                    React Query wrappers (thin, no business logic)
    ├── components/               Presentational components
    ├── modals/                   Dialog components + modal registry
    └── pages/                    Page containers
```

### When to create a separate domain model?

| Situation                                          | Approach                                      |
| -------------------------------------------------- | --------------------------------------------- |
| DTO has everything UI needs                        | `type RoleItem = Role` or use `Role` directly |
| UI needs computed/derived properties               | Self-defined interface + mapper in use case   |
| Type exists only in frontend (filters, form state) | Define in `_domain/*.model.ts`                |

### Reference: `roles_permissions` module

```
roles_permissions/
├── _domain/
│   ├── roles/
│   │   ├── roles.rules.ts           canDeleteRole(), ROLE_NAME_MIN_LENGTH, ...
│   │   └── roles.model.ts           RolesFilters (UI-specific, not in API)
│   └── permissions/
│       ├── permissions.rules.ts      parsePermissionKey(), PERMISSION_GROUPS
│       └── permissions.model.ts      PermissionItem (self-defined)
│
├── _api/
│   ├── roles/
│   │   ├── roles.api.ts              CRUD operations via axiosInstance
│   │   └── roles.type.ts             Role, RoleCreateRequest (from OpenAPI)
│   └── permissions/
│       ├── permissions.api.ts
│       └── permissions.type.ts
│
├── _usecases/
│   ├── roles/
│   │   ├── roles.port.ts             IRolesPort — Gateway implements; use cases depend on this only
│   │   ├── list-roles/               validate filters → map → call port → map response
│   │   ├── create-role/              validate form → map → call port → map response
│   │   ├── update-role/
│   │   ├── delete-role/
│   │   ├── get-role-by-id/
│   │   ├── get-role-permissions/
│   │   └── set-role-permissions/
│   └── permissions/
│       ├── permissions.port.ts       IPermissionsPort
│       └── list-permissions/
│
├── _routes/                          Module routing (parent + children)
├── roles/                            Sub-feature: adapter layer
│   ├── hooks/                        useRolesList, useCreateRoleMutation, ...
│   ├── components/                   RolesTable, RolesFilters, RoleForm
│   ├── modals/                       CreateRoleModal, UpdateRoleModal, ...
│   └── pages/                        RolesManagementPage
└── permissions/                      Sub-feature: adapter layer
    ├── hooks/                        usePermissionsCatalog
    └── pages/                        PermissionsListPage
```

---

## Path Aliases

| Alias        | Path            |
| ------------ | --------------- |
| `@core/*`    | `src/@core/*`   |
| `@themes/*`  | `src/@themes/*` |
| `@modules/*` | `src/modules/*` |
| `@shared/*`  | `src/shared/*`  |
| `@routes/*`  | `src/routes/*`  |
| `@public/*`  | `public/*`      |
| `@scripts/*` | `scripts/*`     |

---

## Data Flow Example

```typescript
// 1. 🔵 Domain — business rules
// _domain/roles/roles.rules.ts
export const ROLE_NAME_MIN_LENGTH = 2;
export function canDeleteRole(role: Pick<Role, "isSystem">) {
  return !role.isSystem;
}

// 2. 🟢 Use Case — validation (references domain rules)
// _usecases/roles/create-role/create-role.validation.ts
export const createRoleSchema = z.object({
  name: z.string().min(ROLE_NAME_MIN_LENGTH),
});

// 3. 🟢 Use Case — mapper (bridges DTO ↔ domain)
// _usecases/roles/create-role/create-role.mapper.ts
export function mapCreateRoleFormToApi(form: CreateRoleSchema): RoleCreateRequest {
  return { name: form.name.trim(), ... };
}

// 4. 🟢 Use Case — orchestration (pure async, no React); depends only on IRolesPort (inner)
// _usecases/roles/create-role/create-role.usecase.ts
export async function createRoleUseCase(api: IRolesPort, formData: CreateRoleSchema) {
  const validated = createRoleSchema.parse(formData);
  const request = mapCreateRoleFormToApi(validated);
  return api.createRole(request);
}

// 5. 🟡 Adapter — hook injects gateway when calling use case (use case never imports _api)
// roles/hooks/useCreateRoleMutation.ts
import rolesApi from "@modules/.../_api/roles/roles.api";
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleSchema) => createRoleUseCase(rolesApi, data),
    onSuccess: () => {
      toast.success("Role created");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}

// 6. 🟡 Adapter — component (uses hook + validation)
// roles/modals/CreateRoleModal.tsx
const methods = useForm({ resolver: zodResolver(createRoleSchema) });
const { mutate } = useCreateRoleMutation();
const onSubmit = (data) => mutate(data);
```

---

## Adding a New Feature

### 1. Create module structure

```bash
mkdir -p src/modules/products/{_domain,_api,_usecases,_routes,hooks,components,pages}
```

### 2. Define API types (`_api/products.type.ts`)

```typescript
import type { components } from "@core/api-contract/openapi";
export type Product = components["schemas"]["Product"];
export type ProductCreateRequest =
  components["schemas"]["ProductCreateRequest"];
```

### 3. Create API gateway (`_api/products.api.ts`)

```typescript
import axiosInstance from "@core/axios";
const productsApi = {
  getAll: async params => {
    const res = await axiosInstance.get("/products", { params });
    return res.data;
  },
};
export default productsApi;
```

### 4. Add domain rules if needed (`_domain/product.rules.ts`)

```typescript
export const MIN_PRICE = 0;
export const MAX_NAME_LENGTH = 100;
```

### 5. Create use case (`_usecases/list/list.usecase.ts`)

```typescript
export async function getProductsListUseCase(filters) {
  const validated = filtersSchema.parse(filters);
  return productsApi.getAll(validated);
}
```

### 6. Create hook (`hooks/useProductsList.ts`)

```typescript
export function useProductsList(filters) {
  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: () => getProductsListUseCase(filters),
  });
}
```

### 7. Create route with metadata (`_routes/index.tsx`)

```tsx
import type { RouteWithMeta } from "@shared/types/route.type";

const productsRoute: RouteWithMeta = {
  path: "/products",
  element: <ProductsPage />,
  meta: { label: "Products", icon: <Inventory />, showInMenu: true, order: 4 },
};
export default productsRoute;
```

### 8. Register in `routes/privateRoute.tsx`

```typescript
import productsRoute from "@modules/products/_routes";
export const privateRouteChildren = [...existing, productsRoute];
```

Menu appears automatically.

---

## Modal Engine

Centralized modal management with registry pattern.

```typescript
// 1. Create modal registry
export const ProductModalKeys = { ConfirmDelete: "products/ConfirmDelete" };
export const productsModalRegistry = {
  [ProductModalKeys.ConfirmDelete]: ConfirmDeleteModal,
};

// 2. Register in page
useRegisterModals(productsModalRegistry);

// 3. Open from anywhere
const { open } = useModalController();
open(ProductModalKeys.ConfirmDelete, { productId: "123" });

// 4. Render engine
<ModalEngine />
```

See `src/@core/modal/README.md` for details.

---

## Mock API (MSW)

MSW is enabled in development to mock API responses.

```
src/@core/__mocks__/
├── browser.ts                    MSW worker (dev)
├── node.ts                       MSW server (tests)
├── handlers.ts                   Aggregates all handlers
└── handlers/
    ├── auth/index.ts
    ├── users/index.ts
    ├── employees/index.ts
    ├── organizations/index.ts
    └── permissions/index.ts
```

Add a new handler:

```typescript
// handlers/products/index.ts
import { http, HttpResponse } from "msw";

export const productsHandlers = [
  http.get("/api/products", () => {
    return HttpResponse.json({ data: [...], meta: { page: 1, pageSize: 20, totalItems: 100 } });
  }),
];

// handlers.ts
import { productsHandlers } from "./handlers/products/index.js";
export const handlers = [...existing, ...productsHandlers];
```

---

## Scripts

| Script                 | Description                                |
| ---------------------- | ------------------------------------------ |
| `pnpm dev`             | Dev server (http://localhost:5173)         |
| `pnpm build`           | Production build                           |
| `pnpm preview`         | Preview production build                   |
| `pnpm lint`            | ESLint check                               |
| `pnpm test`            | Run tests (Vitest)                         |
| `pnpm coverage`        | Test coverage report                       |
| `pnpm codegen`         | Generate OpenAPI types from `openapi.yaml` |
| `pnpm generate:colors` | Generate theme color palettes              |

---

## Commit Convention

Uses **Husky + Commitlint** with conventional commits:

```bash
feat: add products module
fix: resolve login validation error
chore: update dependencies
docs: update README
refactor: extract shared table component
test: add unit tests for createRoleUseCase
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`

---

## Documentation

| Document                                                           | When to read                                |
| ------------------------------------------------------------------ | ------------------------------------------- |
| [Clean Architecture Summary](./docs/CLEAN_ARCHITECTURE_SUMMARY.md) | First read — 5 min overview                 |
| [Architecture](./docs/ARCHITECTURE.md)                             | Deep dive — layers, diagrams, data flow     |
| [Dependency Rules](./docs/DEPENDENCY_RULES.md)                     | Before coding — import rules between layers |
| [Module Template](./docs/MODULE_TEMPLATE.md)                       | When creating a new feature                 |

---

## References

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [MSW](https://mswjs.io/)
- [Zod](https://zod.dev/)
