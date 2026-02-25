# Clean Architecture - Quick Reference

Tóm tắt áp dụng Clean Architecture trong dự án.

## 🎯 Core Principles

1. **Dependency Rule**: Dependencies chỉ đi từ ngoài vào trong (outer → inner)
2. **Independence**: Business logic không phụ thuộc vào frameworks/UI/database
3. **Testability**: Từng layer test độc lập
4. **Flexibility**: Dễ thay đổi UI, framework, database

## 🔵🟢🟡🔴 4 Layers

```
🔴 Frameworks & Drivers (Outermost)
    ↓ depends on
🟡 Interface Adapters
    ↓ depends on
🟢 Use Cases (Application Business Rules)
    ↓ depends on
🔵 Entities (Enterprise Business Rules - Innermost)
```

### Chi tiết từng layer:

| Layer | Folder trong dự án | Chứa gì | Example |
|-------|-------------------|---------|---------|
| 🔵 **Entities** | `types/`, `_api/*.type.ts` | Domain models, business rules | `Product`, `User` interface |
| 🟢 **Use Cases** | `hooks/`, `_api/*.api.ts`, `utils/` | Business logic, transformations | `useProducts`, `productsApi` |
| 🟡 **Adapters** | `pages/`, `components/` | UI presentation, user interaction | `ProductsPage`, `ProductForm` |
| 🔴 **Frameworks** | `@core/`, `@themes/`, `shared/` | Infrastructure, libraries | Axios, React, MUI |

## 📊 Dependency Flow

```
Pages/Components (🟡)
    ↓ use
Hooks (🟢)
    ↓ call
API Gateway (🟢)
    ↓ use
Types/Models (🔵)
```

**Quy tắc vàng**:
- ✅ Outer → Inner: Pages có thể import hooks
- ❌ Inner → Outer: Types **KHÔNG ĐƯỢC** import pages

## 📁 Module Structure

```
modules/products/
├── types/              🔵 Domain
│   └── Product.type.ts
│
├── _domain/            🔵 Domain (Innermost)
│   ├── <feature>.model.ts   # Business models
│   └── <feature>.rules.ts   # Business rules, constants
│
├── _usecases/          🟢 Use Cases
│   ├── validations.ts       # Zod schemas (uses domain rules)
│   └── mappers.ts           # Transformations (DTO ↔ Model)
│
├── _api/               🟢 Use Cases (Gateway)
│   ├── <feature>.api.ts     # API calls
│   └── <feature>.type.ts    # DTOs
│
├── _providers/         🔴 Infrastructure (optional)
│   └── <Feature>Provider.tsx
│
├── _routes/            🟡 Adapters
│   ├── index.tsx
│   └── path.ts
│
├── <sub-feature>/      # Sub-feature (optional)
│   ├── components/          # 🟡 Adapters
│   ├── hooks/               # 🟢 Use Cases
│   └── pages/               # 🟡 Adapters
│
├── components/         🟡 Adapters (top-level)
├── hooks/              🟢 Use Cases (top-level)
└── pages/              🟡 Adapters (top-level)
```

## 🔄 Data Flow Example

```typescript
// 1. 🔵 Domain - Business Rules
// modules/auth/_domain/auth.rules.ts
export const MIN_PASSWORD_LENGTH = 8;

// 2. 🔵 Domain - Models
// modules/auth/_domain/auth.model.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// 3. 🟢 Use Case - Validation (uses domain rules)
// modules/auth/_usecases/validations.ts
import { MIN_PASSWORD_LENGTH } from "../_domain/auth.rules";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

// 4. 🟢 Use Case - Mapper
// modules/auth/_usecases/mappers.ts
export function mapLoginFormToApi(data: LoginSchema): AuthLoginRequest {
  return {
    usernameOrEmail: data.email.trim(),
    password: data.password,
  };
}

// 5. 🟢 Use Case - API Gateway (uses mapper)
// modules/auth/_api/auth.api.ts
const authApi = {
  login: async (data: AuthLoginRequest) => {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  }
};

// 6. 🟢 Use Case - Hook (uses API)
// modules/auth/login/hooks/useLoginMutate.ts
const useLoginMutate = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

// 7. 🟡 Adapter - Component (uses hook & validation)
// modules/auth/login/components/LoginForm.tsx
function LoginForm() {
  const { mutate } = useLoginMutate();
  const form = useForm({ resolver: zodResolver(loginSchema) });
  
  const onSubmit = (data: LoginSchema) => {
    mutate(mapLoginFormToApi(data));
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

## ✅ Best Practices

### 1. Domain Layer (🔵)

```typescript
// ✅ GOOD: Pure types, no dependencies
export interface Product {
  id: string;
  name: string;
  price: number;
}

export const ProductRules = {
  MIN_PRICE: 0,
  MAX_NAME_LENGTH: 100,
} as const;

// ❌ BAD: Domain imports UI
import Button from '@mui/material/Button'; // ❌
```

### 2. Use Case Layer (🟢)

```typescript
// ✅ GOOD: Business logic, no UI
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
};

// ❌ BAD: Hook chứa JSX
export const useProducts = () => {
  return <div>Products</div>; // ❌
};
```

### 3. Adapter Layer (🟡)

```typescript
// ✅ GOOD: UI sử dụng hooks
function ProductsPage() {
  const { data } = useProducts(); // ← Use Case
  return <ProductList products={data} />;
}

// ❌ BAD: UI có business logic
function ProductsPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('/products').then(setData); // ❌
  }, []);
}
```

## 🧪 Testing Strategy

| Layer | Test Type | Coverage | Focus |
|-------|-----------|----------|-------|
| 🔵 Domain | Unit | 100% | Business rules, validators |
| 🟢 Use Cases | Unit + Integration | 90% | Hooks, API calls, transformations |
| 🟡 Adapters | Integration | 70% | Components + hooks together |
| 🔴 E2E | End-to-end | 5% | Critical user flows |

## 🚫 Common Mistakes

### ❌ Mistake 1: Domain phụ thuộc Use Case

```typescript
// ❌ BAD: types/Product.type.ts
import { productsApi } from '../_api/products.api'; // ❌

export const getDefaultProduct = async () => {
  return await productsApi.getDefault(); // ❌
};
```

**Fix**: Logic này thuộc Use Case, không phải Domain.

### ❌ Mistake 2: Use Case phụ thuộc Adapter

```typescript
// ❌ BAD: hooks/useProducts.ts
import ProductCard from '../components/ProductCard'; // ❌

export const useProducts = () => {
  return {
    data: products,
    render: () => <ProductCard /> // ❌
  };
};
```

**Fix**: Hook chỉ trả data, để Adapter quyết định UI.

### ❌ Mistake 3: Hardcode framework trong Use Case

```typescript
// ❌ BAD: _api/products.api.ts
import axios from 'axios'; // ❌ Direct dependency

export const productsApi = {
  getAll: async () => await axios.get('/products'),
};
```

**Fix**: Inject HTTP client qua interface hoặc dùng wrapper từ infrastructure.

```typescript
// ✅ GOOD
import axiosInstance from '@core/axios'; // ← Infrastructure wrapper

export const productsApi = {
  getAll: async () => await axiosInstance.get('/products'),
};
```

## 🎓 Learning Path

1. **Hiểu Dependency Rule** → Dependencies chỉ đi vào trong
2. **Tách Domain** → Types + business rules không phụ thuộc gì
3. **Use Cases thuần** → Logic không có UI
4. **Adapters mỏng** → Chỉ kết nối Use Cases với UI
5. **Framework bọc ngoài** → Dễ swap React → Vue

## 📚 Read More

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full documentation với diagrams chi tiết
- [DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md) - Chi tiết quy tắc import giữa layers
- [MODULE_TEMPLATE.md](./MODULE_TEMPLATE.md) - Template & examples đầy đủ

---

**TL;DR**: Inner layers (Domain, Use Cases) không biết gì về outer layers (UI, Frameworks). Dependencies chỉ đi từ ngoài vào trong.
