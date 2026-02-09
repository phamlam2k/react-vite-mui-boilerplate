# React Vite MUI Boilerplate

Boilerplate React + TypeScript + Vite với cấu trúc modular theo **Clean Architecture**, MUI, TanStack Query, React Router 7 và các convention dành cho team.

---

## 🚀 Quick Start

```bash
# Cài đặt dependencies
pnpm install

# Chạy dev server
pnpm dev

# Build production
pnpm build
```

---

## 👋 Dành cho người mới vào team

### Bước 1: Hiểu kiến trúc (30 phút)

Đọc theo thứ tự:

1. **[📖 Clean Architecture Summary](./docs/CLEAN_ARCHITECTURE_SUMMARY.md)** (5 phút)  
   ⭐ Bắt đầu từ đây! Tóm tắt ngắn gọn về 4 layers, dependency rules, best practices.

2. **[🏗️ Architecture Documentation](./docs/ARCHITECTURE.md)** (15 phút)  
   Chi tiết đầy đủ với diagrams: layers, data flow, testing strategy, cross-cutting concerns.

3. **[🔒 Dependency Rules](./docs/DEPENDENCY_RULES.md)** (5 phút)  
   Quy tắc import giữa các layers (core, modules, shared). Ví dụ violations + cách fix.

4. **[📦 Module Template](./docs/MODULE_TEMPLATE.md)** (5 phút)  
   Template đầy đủ khi tạo feature mới. Copy & paste friendly!

### Bước 2: Khám phá codebase

```
src/
├── @core/          # Infrastructure (axios, auth, modal engine, layouts)
├── @themes/        # Design system (MUI theme, colors, overrides)
├── modules/        # Features (auth, dashboard, settings)
│   └── <feature>/
│       ├── _api/       # 🟢 Use Cases: API calls
│       ├── _routes/    # 🟡 Adapters: Route config
│       ├── hooks/      # 🟢 Use Cases: Business logic
│       ├── pages/      # 🟡 Adapters: UI containers
│       ├── components/ # 🟡 Adapters: UI components
│       └── utils/      # 🟢 Use Cases: Validators, mappers
├── routes/         # Top-level routing (public, private)
└── shared/         # Reusable primitives (không business logic)
```

### Bước 3: Thử tạo feature mới

Xem [Module Template](./docs/MODULE_TEMPLATE.md) để tạo feature "Products" mẫu.

**Quy trình ngắn gọn**:
1. Tạo `modules/products/` với cấu trúc chuẩn
2. Thêm route với **metadata** (label, icon, showInMenu)
3. Import vào `routes/privateRoute.tsx`
4. Menu tự động xuất hiện! 🎉

---

## 📚 Documentation

| Document | Mô tả | Khi nào đọc |
|----------|-------|-------------|
| [Clean Architecture Summary](./docs/CLEAN_ARCHITECTURE_SUMMARY.md) | Tóm tắt 4 layers, dependency rules, best practices | ⭐ Đọc đầu tiên |
| [Architecture](./docs/ARCHITECTURE.md) | Chi tiết layers, data flows, testing, diagrams đầy đủ | Khi cần hiểu sâu |
| [Dependency Rules](./docs/DEPENDENCY_RULES.md) | Import rules giữa layers, violations & fixes | Trước khi code |
| [Module Template](./docs/MODULE_TEMPLATE.md) | Template & example đầy đủ cho feature mới | Khi tạo feature mới |

---

## 🛠️ Tech Stack

| Thư viện | Mục đích |
|----------|----------|
| React 19 | UI framework |
| Vite 7 | Build tool |
| TypeScript | Type safety |
| MUI (Material UI) 7 | Design system, components |
| Tailwind CSS 4 | Utility CSS |
| React Router 7 | Routing |
| TanStack Query | Data fetching, cache |
| React Hook Form + Zod | Form validation |
| Zustand | State management |
| Axios | HTTP client |
| MSW | Mock API (development/test) |
| Vitest | Unit/integration test |

---

## 📂 Cấu trúc thư mục

```
src/
├── @core/                    # 🔴 Infrastructure Layer
│   ├── __mocks__/            # MSW handlers cho dev/test
│   ├── app-shell/            # Layout, drawer, header, menu
│   ├── axios/                # HTTP client config
│   ├── constants/            # App config
│   ├── errors/               # Error pages (401, 404, 500)
│   ├── middlewares/          # Route middlewares (auth, logs)
│   ├── modal/                # Modal engine
│   └── providers/            # Root providers (theme, auth, query)
│
├── @themes/                  # 🔴 Design System
│   ├── _customize/           # Theme customization
│   ├── colors/               # Color palettes (light/dark)
│   ├── overrides/            # MUI component overrides
│   └── providers/            # Theme provider
│
├── modules/                  # 🟢 Feature Modules (Business Logic)
│   ├── auth/                 # Authentication feature
│   │   ├── _api/             # Auth API calls
│   │   ├── _routes/          # Auth routes
│   │   └── login/
│   │       ├── components/   # LoginForm
│   │       ├── hooks/        # useLoginMutate
│   │       ├── pages/        # LoginPage
│   │       └── utils/        # Validators, mappers
│   ├── dashboard/            # Dashboard feature
│   └── settings/             # Settings feature
│       ├── account/          # Sub-feature
│       └── color/            # Sub-feature
│
├── routes/                   # 🟡 Top-level Routing
│   ├── privateRoute.tsx      # Protected routes (dashboard, settings)
│   ├── publicRoute.tsx       # Public routes (auth)
│   └── wildcardRoute.tsx     # 404 fallback
│
├── shared/                   # Reusable Primitives (no business logic)
│   ├── components/           # UI atoms (Button, Input, Chart)
│   ├── hooks/                # Generic hooks (useDebounce)
│   ├── types/                # Shared types
│   └── utils/                # Pure utilities
│
├── App.tsx
├── AppRouter.tsx
├── main.tsx
└── index.css
```

---

## 🔑 Path Aliases

| Alias | Đường dẫn |
|-------|-----------|
| `@core/*` | `src/@core/*` |
| `@themes/*` | `src/@themes/*` |
| `@modules/*` | `src/modules/*` |
| `@shared/*` | `src/shared/*` |
| `@routes/*` | `src/routes/*` |
| `@public/*` | `public/*` |
| `@scripts/*` | `scripts/*` |

---

## 🎨 Convention

### Module Structure (Clean Architecture)

Mỗi feature trong `modules/<feature>/` theo cấu trúc:

```
modules/<feature>/
├── _api/               # 🟢 Use Cases: API gateway
│   ├── <feature>.api.ts
│   └── <feature>.type.ts
├── _routes/            # 🟡 Adapters: Route config
│   ├── index.tsx       # Route với metadata (label, icon)
│   └── path.ts         # Path constants
├── components/         # 🟡 Adapters: UI components
├── hooks/              # 🟢 Use Cases: Business logic
├── pages/              # 🟡 Adapters: Page containers
├── types/              # 🔵 Domain: Business models (optional)
└── utils/              # 🟢 Use Cases: Validators, mappers
```

### Dependency Rules

**Quy tắc vàng**: Dependencies chỉ đi từ **ngoài vào trong**.

```
🔴 Frameworks (React, Axios, MUI)
    ↓ depends on
🟡 Adapters (Pages, Components)
    ↓ depends on
🟢 Use Cases (Hooks, API, Utils)
    ↓ depends on
🔵 Domain (Types, Models)
```

- ✅ Pages có thể import hooks
- ✅ Hooks có thể import API
- ✅ API có thể import types
- ❌ Types **KHÔNG ĐƯỢC** import hooks/pages

Xem chi tiết: [Dependency Rules](./docs/DEPENDENCY_RULES.md)

### Lazy Loading

```tsx
// modules/settings/account/_routes/lazy.tsx
import { lazy } from "react";

export const AccountSettingPageLazy = lazy(
  () => import("../pages/AccountSettingPage")
);

// modules/settings/account/_routes/index.tsx
import { AccountSettingPageLazy } from "./lazy";

const accountSettingRoute: RouteWithMeta = {
  path: "/settings/account",
  element: <AccountSettingPageLazy />,
  meta: { label: "Account", showInMenu: true },
};
```

---

## 📜 Scripts

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Chạy dev server (http://localhost:5173) |
| `pnpm build` | Build production |
| `pnpm preview` | Preview build |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run tests với Vitest |
| `pnpm coverage` | Test coverage report |
| `pnpm codegen` | Generate API client từ `swagger.json` |
| `pnpm generate:colors` | Generate theme colors |

---

## 🧪 Mock API (MSW)

Trong development, **MSW (Mock Service Worker)** được bật để mock API.

**Files**:
- `src/@core/__mocks__/handlers.ts` - Gộp tất cả handlers
- `src/@core/__mocks__/handlers/auth/index.ts` - Auth handlers
- `src/@core/__mocks__/node.ts` - MSW server cho tests
- `src/@core/__mocks__/browser.ts` - MSW worker cho dev

**Thêm handler mới**:
1. Tạo `src/@core/__mocks__/handlers/<domain>/index.ts`
2. Export handlers array
3. Import vào `handlers.ts`

```typescript
// handlers/products/index.ts
import { http, HttpResponse } from "msw";

export const productsHandlers = [
  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "1", name: "Product 1", price: 100 }
    ]);
  }),
];

// handlers.ts
import { productsHandlers } from "./handlers/products/index.js";

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
];
```

---

## 🆕 Thêm Feature Mới

**Quick guide** (chi tiết xem [Module Template](./docs/MODULE_TEMPLATE.md)):

```bash
# 1. Tạo structure
mkdir -p src/modules/products/{_api,_routes,components,hooks,pages,utils}

# 2. Tạo types
# modules/products/_api/products.type.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

# 3. Tạo API
# modules/products/_api/products.api.ts
import axiosInstance from "@core/axios";

export const productsApi = {
  getAll: async () => {
    const res = await axiosInstance.get('/products');
    return res.data;
  },
};

# 4. Tạo hook
# modules/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../_api/products.api";

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
};

# 5. Tạo page
# modules/products/pages/ProductsPage.tsx
import { useProducts } from "../hooks/useProducts";

function ProductsPage() {
  const { data, isLoading } = useProducts();
  if (isLoading) return <div>Loading...</div>;
  return <div>Products: {data.length}</div>;
}
export default ProductsPage;

# 6. Tạo route với METADATA
# modules/products/_routes/index.tsx
import { Inventory } from "@mui/icons-material";
import type { RouteWithMeta } from "@shared/types/route.type";

const productsRoute: RouteWithMeta = {
  path: "/products",
  element: <ProductsPage />,
  meta: {
    label: "Products",     // ← Hiển thị trong menu
    icon: <Inventory />,   // ← Icon
    showInMenu: true,      // ← Show trong sidebar
    order: 3,              // ← Thứ tự
  },
};
export default productsRoute;

# 7. Import vào privateRoute
# routes/privateRoute.tsx
import productsRoute from "@modules/products/_routes";

export const privateRouteChildren: RouteWithMeta[] = [
  dashboardRoute,
  settingsRoute,
  productsRoute,  // ← Thêm dòng này
];
```

**Kết quả**: Menu tự động có "Products" với icon, đúng vị trí! 🎉

---

## 🧩 Modal Engine

Hệ thống modal tập trung với registry pattern.

**Quick usage**:

```typescript
// 1. Tạo modal registry
// modules/products/modals/products.modal.registry.tsx
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export const ProductModalKeys = {
  ConfirmDelete: "products/ConfirmDelete",
};

export const productsModalRegistry = {
  [ProductModalKeys.ConfirmDelete]: ConfirmDeleteModal,
};

// 2. Tạo modal component
// modules/products/modals/ConfirmDeleteModal.tsx
import { useModalController } from "@core/modal/hooks/useModalController";

function ConfirmDeleteModal({ type, payload }) {
  const { close } = useModalController();
  
  return (
    <BaseModal open onClose={() => close(type)}>
      <h2>Confirm Delete</h2>
      <p>Delete product: {payload.productName}?</p>
      <Button onClick={() => {
        payload.onConfirm();
        close(type);
      }}>Delete</Button>
    </BaseModal>
  );
}

// 3. Sử dụng trong page
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import { useModalController } from "@core/modal/hooks/useModalController";
import { ModalEngine } from "@core/modal/ModalEngine";

function ProductsPage() {
  useRegisterModals(productsModalRegistry);
  const { open } = useModalController();
  
  const handleDelete = (product) => {
    open(ProductModalKeys.ConfirmDelete, {
      productName: product.name,
      onConfirm: () => deleteProduct(product.id),
    });
  };
  
  return (
    <>
      <ProductList onDelete={handleDelete} />
      <ModalEngine />
    </>
  );
}
```

Chi tiết: `src/@core/modal/README.md`

---

## 📦 Code Generation

Generate API client từ OpenAPI/Swagger spec:

```bash
pnpm codegen
```

**Config**: `codegen.js` (sử dụng `swagger-axios-codegen`)  
**Output**: `src/shared/api/generated/`

---

## ✅ Commit Convention

Dự án sử dụng **Husky + Commitlint** với conventional commits:

```bash
# Format: <type>: <description>

feat: thêm module products
fix: sửa lỗi validation trong login form
chore: update dependencies
docs: cập nhật README
refactor: tách logic ra hooks
test: thêm unit test cho useProducts
```

**Types**: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`

---

## 🤝 Contributing

1. Đọc [Clean Architecture Summary](./docs/CLEAN_ARCHITECTURE_SUMMARY.md)
2. Đọc [Dependency Rules](./docs/DEPENDENCY_RULES.md)
3. Follow [Module Template](./docs/MODULE_TEMPLATE.md) khi tạo feature mới
4. Viết tests cho business logic (hooks, utils)
5. Commit theo conventional commits

---

## 📖 Tài liệu tham khảo

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

## 📞 Support

Nếu có câu hỏi về architecture hoặc cần hỗ trợ, tham khảo:

1. [Clean Architecture Summary](./docs/CLEAN_ARCHITECTURE_SUMMARY.md) - Câu hỏi về layers/dependencies
2. [Architecture Documentation](./docs/ARCHITECTURE.md) - Câu hỏi về data flow/testing
3. [Module Template](./docs/MODULE_TEMPLATE.md) - Câu hỏi về cách tạo feature mới
