# Dependency Rules

**Quy tắc vàng**: Layer thấp **KHÔNG ĐƯỢC** import từ layer cao.

## Quick Reference

| From Layer | Can Import | Cannot Import |
|-----------|------------|---------------|
| `modules/` | `@core/`, `@themes/`, `shared/` | other `modules/` |
| `@core/` | `@themes/`, `shared/` | `modules/` |
| `@themes/` | `shared/` | `@core/`, `modules/` |
| `shared/` | - | `@core/`, `@themes/`, `modules/` |
| `routes/` | `modules/`, `@core/` | - |

## Visual Diagram

```
┌─────────────────────────────────────┐
│  routes/                            │
│  ✅ CAN import: modules, @core       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  modules/                           │
│  ✅ CAN import: @core, @themes,      │
│                shared               │
│  ❌ CANNOT: other modules            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  @core/                             │
│  ✅ CAN import: @themes, shared      │
│  ❌ CANNOT: modules                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  @themes/                           │
│  ✅ CAN import: shared               │
│  ❌ CANNOT: @core, modules           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  shared/                            │
│  ❌ CANNOT import anything           │
│  (chỉ external libs)                │
└─────────────────────────────────────┘
```

## Examples

### ✅ ALLOWED

```typescript
// modules/products/pages/ProductsPage.tsx
import axiosInstance from "@core/axios";              // ✅
import { useTheme } from "@themes/hooks";             // ✅
import Button from "@shared/components/Button";       // ✅

// @core/app-shell/layouts/PrivateLayout.tsx
import { extractMenuFromRoutes } from "../utils";     // ✅
import { privateRouteChildren } from "@routes/...";   // ✅

// @themes/colors/index.ts
import { lighten } from "@shared/utils/colorUtils";   // ✅
```

### ❌ NOT ALLOWED

```typescript
// ❌ Core import modules
// @core/app-shell/hooks/useGetMenuList.tsx
import DashboardUrls from "@modules/dashboard/_routes/path"; // ❌

// ❌ Module import other module
// modules/products/pages/ProductsPage.tsx
import { useOrders } from "@modules/orders/hooks";   // ❌

// ❌ Shared import core
// shared/components/Button.tsx
import { useModalController } from "@core/modal";    // ❌

// ❌ Themes import core
// @themes/overrides/button.ts
import { themeConfig } from "@core/constants";       // ❌
```

## Why These Rules?

### 1. **Module Independence**
- Modules không phụ thuộc nhau → dễ refactor, xóa, replace
- Thêm/xóa feature không ảnh hưởng features khác

### 2. **Core Stability**
- Core là foundation → không được phụ thuộc vào business logic
- Khi business thay đổi, core không cần sửa

### 3. **Reusability**
- Shared không biết app-specific logic → dễ copy sang project khác
- Themes độc lập → dễ switch design system

### 4. **Testing**
- Test layer thấp không cần mock layer cao
- Test modules độc lập mà không cần setup toàn bộ app

## Common Violations & Fixes

### Violation 1: Core import modules

```typescript
// ❌ BEFORE
// @core/app-shell/hooks/useGetMenuList.tsx
import DashboardUrls from "@modules/dashboard/_routes/path";

const menu = [
  { path: DashboardUrls.ROOT, label: "Dashboard" }
];
```

**Fix**: Extract từ route metadata thay vì hard-code

```typescript
// ✅ AFTER
// routes/privateRoute.tsx
export const privateRouteChildren = [dashboardRoute, ...];

// @core/app-shell/hooks/useGetMenuList.tsx
import { privateRouteChildren } from "@routes/privateRoute";
import { extractMenuFromRoutes } from "../utils";

const menu = extractMenuFromRoutes(privateRouteChildren);
```

### Violation 2: Module import other module

```typescript
// ❌ BEFORE
// modules/products/hooks/useProductOrders.ts
import { useOrders } from "@modules/orders/hooks";

export const useProductOrders = (productId: string) => {
  const orders = useOrders({ productId });
  return orders;
};
```

**Fix Option 1**: API ở BE kết hợp data
```typescript
// ✅ AFTER - Backend endpoint mới
// modules/products/_api/products.api.ts
export const productsApi = {
  getWithOrders: (id: string) => 
    axiosInstance.get(`/products/${id}/orders`),
};
```

**Fix Option 2**: Tách ra module chung (nếu logic phức tạp)
```typescript
// ✅ AFTER - Module mới
// modules/product-orders/
//   └── hooks/useProductOrders.ts
```

### Violation 3: Shared import core

```typescript
// ❌ BEFORE
// shared/components/LoginButton.tsx
import { useAuth } from "@core/providers/AuthProvider";

export const LoginButton = () => {
  const { login } = useAuth();
  return <button onClick={login}>Login</button>;
};
```

**Fix**: Component này không phải shared, nó thuộc auth module

```typescript
// ✅ AFTER
// modules/auth/components/LoginButton.tsx
import { useAuth } from "@core/providers/AuthProvider";

export const LoginButton = () => {
  const { login } = useAuth();
  return <button onClick={login}>Login</button>;
};
```

## Enforcement

### Manual Check
Trước khi commit, check imports:
```bash
# Tìm core import modules
rg "from ['\"]@modules" src/@core/

# Tìm shared import core/modules
rg "from ['\"]@(core|modules)" src/shared/
```

### ESLint Rule (TODO)
Thêm rule để auto-detect violations:
```js
// eslint.config.js
{
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@modules/*"],
            importNames: ["*"],
            message: "Core cannot import from modules",
          },
        ],
      },
    ],
  },
}
```

## FAQ

**Q: Nếu 2 modules cần dùng chung logic thì sao?**  
A: Có 3 options:
1. Nếu logic thuần (không business), cho vào `shared/utils/`
2. Nếu business logic, tạo module thứ 3 và cả 2 đều dùng
3. Nếu API có thể merge, gọi API mới từ BE

**Q: Module có thể import types từ module khác không?**  
A: **Không**. Nếu cần, extract type vào `shared/types/`.

**Q: Core có thể import routes không?**  
A: **Có**, vì `routes/` là layer cao hơn và nó aggregate modules.

**Q: Sao shared không được import gì?**  
A: Vì shared phải reusable cho bất kỳ project nào. Nếu import core/modules, nó không còn "shared" nữa.

## Summary

| ❌ Never | ⚠️ Avoid | ✅ Always |
|---------|---------|----------|
| Core → modules | Shared → types from core | Module → shared |
| Module A → Module B | Circular deps | Core → shared |
| Shared → core | | Routes → modules |
