# Scripts

## gen-module

Generates Clean Architecture modules so you don’t have to create folders and files by hand.

### Case 1 – Single (top-level) module

Creates a full module under `src/modules/<name>/` with:

- **Domain:** `_domain/<name>.model.ts`, `_domain/<name>.rules.ts`
- **API:** `_api/<name>.type.ts`, `_api/<name>.api.ts`
- **Use cases:** `_usecases/<name>.port.ts`, `.usecases.ts`, `.validations.ts`, `.mappers.ts`
- **Routes:** `_routes/path.ts`, `_routes/index.tsx`
- **Adapters:** `hooks/<name>.use-cases.ts`, `hooks/use<Entity>List.ts`, `pages/<Entity>ManagementPage.tsx`, `components/`, `modals/`, `i18n/`

```bash
pnpm run gen:module products
```

Then register the route in `src/routes/privateRoute.tsx`:

```ts
import { productsRoute } from "@modules/products/_routes";
// Add productsRoute to privateRouteChildren
```

### Case 2 – Nested module (sub-module under a parent)

Creates a sub-module under `src/modules/<parent>/<child>/` and, if needed, parent layers under `<parent>/_domain/<child>/`, `_api/<child>/`, `_usecases/<child>/`. Also creates or updates `_routes/paths.ts` with the new path constant.

```bash
pnpm run gen:module roles_permissions permissions
```

Then add the child route in the parent’s `_routes/index.tsx`:

```ts
import permissionsRoute from "../permissions/_routes";
// In children: [ ..., permissionsRoute ]
```

### Conventions

- **Module name:** lowercase, use `_` for multiple words (e.g. `roles_permissions`, `product_catalog`).
- **Entity name:** inferred from the module name (e.g. `products` → `Product`, `roles` → `Role`).
- **Paths:** Single module uses `_routes/path.ts`; parent with children uses `_routes/paths.ts` and path constants (e.g. `ROLES`, `PERMISSIONS`).

### Principles

- **SRP:** Each generator focuses on one layer (domain, api, usecases, routes, adapters).
- **DRY:** Shared naming helpers (`toEntityName`, `filePrefix`, `alias`).
- **Consistency:** Structure and naming match existing modules (users, roles_permissions).
