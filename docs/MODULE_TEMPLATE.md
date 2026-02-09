# Module Template

Template chuẩn cho mỗi feature module mới.

## Structure

```
modules/<feature>/
├── _api/               # API layer
│   ├── <feature>.api.ts
│   └── <feature>.type.ts
├── _routes/            # Routing config
│   ├── index.tsx       # Route object với metadata
│   └── path.ts         # Path constants
├── components/         # Internal components
│   └── <Component>.tsx
├── hooks/              # Custom hooks
│   └── use<Feature>.ts
├── pages/              # Page components
│   └── <Feature>Page.tsx
├── types/              # Feature types (optional nếu nhiều)
│   └── index.ts
└── utils/              # Helpers, validators
    ├── validations.ts
    └── mappers.ts
```

## Example: Products Module

### 1. Path Constants

```typescript
// modules/products/_routes/path.ts
class ProductUrls {
  static readonly ROOT = "/products";
  static readonly CREATE = `${ProductUrls.ROOT}/create`;
  static readonly DETAIL = (id: string) => `${ProductUrls.ROOT}/${id}`;
  static readonly EDIT = (id: string) => `${ProductUrls.ROOT}/${id}/edit`;
}

export default ProductUrls;
```

### 2. Route Config với Metadata

```typescript
// modules/products/_routes/index.tsx
import { Inventory } from "@mui/icons-material";
import type { RouteWithMeta } from "@shared/types/route.type";
import ProductsPage from "../pages/ProductsPage";
import ProductUrls from "./path";

const productsRoute: RouteWithMeta = {
  path: ProductUrls.ROOT,
  element: <ProductsPage />,
  meta: {
    label: "Products",           // Hiển thị trong menu
    icon: <Inventory />,         // Icon trong menu
    showInMenu: true,            // Có show trong sidebar không
    order: 3,                    // Thứ tự sắp xếp (nhỏ hơn = cao hơn)
    roles: ["admin", "manager"], // (Optional) RBAC roles
    description: "Manage products", // (Optional) Tooltip/breadcrumb
  },
};

export default productsRoute;
```

### 3. API Types

```typescript
// modules/products/_api/products.type.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 4. API Layer

```typescript
// modules/products/_api/products.api.ts
import axiosInstance from "@core/axios";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
} from "./products.type";

export const productsApi = {
  /**
   * Lấy danh sách products
   */
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await axiosInstance.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  /**
   * Lấy chi tiết 1 product
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Tạo product mới
   */
  create: async (data: CreateProductRequest) => {
    const response = await axiosInstance.post<Product>("/products", data);
    return response.data;
  },

  /**
   * Cập nhật product
   */
  update: async ({ id, ...data }: UpdateProductRequest) => {
    const response = await axiosInstance.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Xóa product
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};

export default productsApi;
```

### 5. Custom Hooks

```typescript
// modules/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../_api/products.api";

export const useProducts = (params?: { page?: number; search?: string }) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// modules/products/hooks/useProductById.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../_api/products.api";

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id, // Chỉ fetch khi có id
  });
};

// modules/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../_api/products.api";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      // Invalidate để refetch danh sách
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
```

### 6. Validation (với Zod)

```typescript
// modules/products/utils/validations.ts
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  stock: z.number().int().min(0, "Tồn kho phải >= 0"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export const productSchemaResolver = zodResolver(productSchema);
```

### 7. Mapper (Form ↔ API)

```typescript
// modules/products/utils/mappers.ts
import type { ProductFormData } from "./validations";
import type { CreateProductRequest } from "../_api/products.type";

/**
 * Map từ form data sang API request
 */
export function mapProductFormToApi(
  data: ProductFormData
): CreateProductRequest {
  return {
    name: data.name.trim(),
    price: Number(data.price),
    stock: Number(data.stock),
  };
}

/**
 * Map từ API response sang form data (để edit)
 */
export function mapProductApiToForm(
  product: Product
): ProductFormData {
  return {
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
}
```

### 8. Components

```typescript
// modules/products/components/ProductForm.tsx
import { FormProvider, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import { productSchemaResolver, type ProductFormData } from "../utils/validations";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: productSchemaResolver,
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <BaseTextFieldForm
          name="name"
          label="Product Name"
          placeholder="Enter product name"
        />
        <BaseTextFieldForm
          name="price"
          label="Price"
          type="number"
          placeholder="0"
        />
        <BaseTextFieldForm
          name="stock"
          label="Stock"
          type="number"
          placeholder="0"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </FormProvider>
  );
}
```

### 9. Page

```typescript
// modules/products/pages/ProductsPage.tsx
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import { useProducts } from "../hooks/useProducts";
import ProductTable from "../components/ProductTable";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProducts({ page });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Typography variant="h4" fontWeight={700}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          href="/products/create"
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductTable
          products={data.data}
          total={data.total}
          page={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
```

### 10. Register Route

```typescript
// routes/privateRoute.tsx
import productsRoute from "@modules/products/_routes";

export const privateRouteChildren: RouteWithMeta[] = [
  dashboardRoute,
  settingsRoute,
  productsRoute,  // ← Thêm dòng này
];
```

**Xong!** Menu tự động xuất hiện "Products" với icon Inventory, thứ tự 3.

## Testing Structure (Optional)

```
modules/products/
├── __tests__/
│   ├── hooks/
│   │   └── useProducts.test.ts
│   ├── utils/
│   │   ├── validations.test.ts
│   │   └── mappers.test.ts
│   └── components/
│       └── ProductForm.test.tsx
```

### Example Test

```typescript
// modules/products/__tests__/hooks/useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "../../hooks/useProducts";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe("useProducts", () => {
  it("should fetch products successfully", async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data.data)).toBe(true);
  });
});
```

## Checklist khi tạo module mới

- [ ] Tạo folder structure đầy đủ
- [ ] Tạo `_routes/path.ts` với path constants
- [ ] Tạo `_routes/index.tsx` với **metadata** (label, icon, showInMenu, order)
- [ ] Tạo `_api/<feature>.type.ts` với types đầy đủ
- [ ] Tạo `_api/<feature>.api.ts` với CRUD operations
- [ ] Tạo hooks (useXXXQuery, useXXXMutation)
- [ ] (Nếu có form) Tạo `utils/validations.ts` với Zod schema
- [ ] (Nếu có form) Tạo `utils/mappers.ts` để map form ↔ API
- [ ] Tạo components nội bộ nếu cần
- [ ] Tạo page chính
- [ ] Import route vào `privateRouteChildren`
- [ ] Test menu tự động xuất hiện
- [ ] (Optional) Viết tests

## Quy tắc quan trọng

1. **Không import từ module khác**: Feature phải độc lập.
2. **API types nằm cạnh API**: Dễ maintain.
3. **Hook wrap API call**: Không call axios trực tiếp trong component.
4. **Validation với Zod**: Type-safe + runtime validation.
5. **Mapper tách biệt**: Form schema ≠ API schema.
6. **Metadata đầy đủ**: Menu/breadcrumb tự động generate.
