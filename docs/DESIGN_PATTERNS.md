# Design Patterns

> Tài liệu này liệt kê toàn bộ design patterns đang được áp dụng trong dự án, kèm code thực tế và lý do sử dụng.

## Mục lục

**Nhóm 1 — Architectural Patterns**
- [1. Dependency Inversion Principle](#1-dependency-inversion-principle)
- [2. Port & Adapter (Hexagonal)](#2-port--adapter-hexagonal)
- [3. Composition Root](#3-composition-root)

**Nhóm 2 — GoF Behavioral Patterns**
- [4. Strategy](#4-strategy)
- [5. Template Method](#5-template-method)
- [6. Observer](#6-observer)
- [7. Chain of Responsibility (Error Hierarchy)](#7-chain-of-responsibility-error-hierarchy)
- [8. Interceptor](#8-interceptor)

**Nhóm 3 — GoF Structural / Creational**
- [9. Data Mapper](#9-data-mapper)
- [10. Registry](#10-registry)

**Nhóm 4 — React-specific Patterns**
- [11. Query Key Factory](#11-query-key-factory)
- [12. Guard](#12-guard)
- [13. Compound Component](#13-compound-component)

---

## Nhóm 1 — Architectural Patterns

---

### 1. Dependency Inversion Principle

**Định nghĩa**: High-level module không phụ thuộc low-level module. Cả hai phụ thuộc vào abstraction (interface). Abstraction không phụ thuộc vào details — details phụ thuộc vào abstraction.

**Ở đâu trong dự án**: Xuyên suốt toàn bộ — mọi `*UseCases` class đều nhận dependencies qua constructor thông qua interface, không bao giờ import concrete class trực tiếp.

**Sơ đồ**:

```
UsersUseCases   ──depends on──▶  IUsersPort         ◀──implements──  UsersApiGateway
RolesUseCases   ──depends on──▶  IRolesPort         ◀──implements──  RolesApiGateway
                ──depends on──▶  ICurrentUserPort   ◀──implements──  CurrentUserAdapter
EmployeesUseCases ──depends on──▶ IEmployeesPort    ◀──implements──  EmployeesApiGateway
```

**Code**:

```typescript
// ✅ Đúng: UsersUseCases chỉ biết IUsersPort (interface)
// src/modules/users/_usecases/users.usecases.ts
export class UsersUseCases {
  private readonly api: IUsersPort;           // ← interface, không phải UsersApiGateway
  private readonly currentUser: ICurrentUserPort | null;

  constructor(api: IUsersPort, currentUser: ICurrentUserPort | null = null) {
    this.api = api;
    this.currentUser = currentUser;
  }
}

// ❌ Sai: sẽ tạo ra tight coupling
export class UsersUseCases {
  private readonly api = new UsersApiGateway(); // ← hard-coded concrete class
}
```

**Ports (abstractions)**:

```typescript
// src/modules/users/_usecases/users.port.ts
export interface IUsersPort {
  getUsersList(params: UserListRequest): Promise<UserListResponse>;
  createUser(data: UserCreateRequest): Promise<UserProfile>;
  updateUser(data: UserUpdateRequestBody): Promise<UserProfile>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<UserProfile>;
}

// src/modules/employees/_usecases/employees.port.ts
export interface IEmployeesPort {
  getEmployeesList(params: EmployeeListParams): Promise<EmployeeListResponse>;
  createEmployee(data: EmployeeCreateRequest): Promise<EmployeeProfile>;
  getEmployeeById(employeeId: string): Promise<EmployeeProfile>;
  updateEmployee(payload: EmployeeUpdateRequestBody): Promise<EmployeeProfile>;
  deleteEmployee(employeeId: string): Promise<void>;
}

// src/modules/roles_permissions/_usecases/roles/roles.port.ts
export interface IRolesPort {
  listRoles(params: RoleListRequest): Promise<RoleListResponse>;
  createRole(data: RoleCreateRequest): Promise<Role>;
  getRoleById(roleId: string): Promise<Role>;
  updateRole(payload: RoleUpdateRequestBody): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;
  getRolePermissions(roleId: string): Promise<PermissionListResponse>;
  setRolePermissions(roleId: string, data: RolePermissionsUpdateRequest): Promise<PermissionListResponse>;
}
```

**Lợi ích**:
- Thay `UsersApiGateway` (REST) bằng `GraphQLUsersGateway` → chỉ cần viết class mới implement `IUsersPort`, `UsersUseCases` không đổi một dòng
- Trong test: inject `mockApi` → không cần HTTP server
- Use Cases không biết Axios, cookies, hay bất cứ thứ gì của infrastructure

---

### 2. Port & Adapter (Hexagonal)

**Định nghĩa**: Application core (Domain + Use Cases) được bao bọc bởi "ports" (interfaces). Bên ngoài, "adapters" kết nối với thế giới thật (HTTP, UI, DB) thông qua những port đó. Core hoàn toàn độc lập.

**Ở đâu trong dự án**:

| Loại | File | Mô tả |
|------|------|-------|
| **Port** (driven) | `_usecases/*/roles.port.ts` | Use Cases → Infrastructure |
| **Port** (driving) | `shared/ports/current-user.port.ts` | Infrastructure → Use Cases |
| **Adapter** (HTTP) | `_api/*/roles.api.ts` | Implements driven port qua Axios |
| **Adapter** (State) | `shared/adapters/current-user.adapter.ts` | Implements driving port qua Zustand |

**Sơ đồ Hexagonal**:

```
                    ┌─────────────────────────────┐
                    │      APPLICATION CORE        │
  [ UI Hooks ]──────▶  Port: IRolesPort            │
                    │  ↕                           │
  [ API Gateway ]──▶  RolesUseCases               │
  implements Port   │  ↕                           │
                    │  Port: ICurrentUserPort       │◀────[ CurrentUserAdapter ]
                    │                              │      reads Zustand store
                    └─────────────────────────────┘
```

**Code — Port (interface sống trong Use Case layer)**:

```typescript
// src/modules/roles_permissions/_usecases/roles/roles.port.ts
// ⚠️ Port nằm trong Use Case layer — Use Cases SỞ HỮU interface này
export interface IRolesPort {
  listRoles(params: RoleListRequest): Promise<RoleListResponse>;
  createRole(data: RoleCreateRequest): Promise<Role>;
  // ...
}
```

**Code — Adapter (implements port, nằm ở outer layer)**:

```typescript
// src/modules/roles_permissions/_api/roles/roles.api.ts
// Adapter biết về HTTP — Use Cases không biết điều này
export class RolesApiGateway implements IRolesPort {
  async listRoles(params: RoleListRequest): Promise<RoleListResponse> {
    const response = await axiosInstance.get<RoleListResponse>(
      RolesApiRoutes.Roles,
      { params }
    );
    return response.data;
  }

  async createRole(data: RoleCreateRequest): Promise<Role> {
    const response = await axiosInstance.post<Role>(RolesApiRoutes.Roles, data);
    return response.data;
  }
  // ...
}
```

**Code — Shared Port (cross-cutting)**:

```typescript
// src/shared/ports/current-user.port.ts
export interface ICurrentUserPort {
  getPermissions(): string[];
  getUserId(): string | null;
}

// src/shared/adapters/current-user.adapter.ts
// Adapter biết về Zustand — Use Cases không biết điều này
export class CurrentUserAdapter implements ICurrentUserPort {
  getPermissions(): string[] {
    return useAuthStore.getState().permissions;
  }
  getUserId(): string | null {
    return useAuthStore.getState().userId;
  }
}
```

**Lợi ích**: Core business logic có thể chạy độc lập, không cần browser, không cần network, không cần React.

---

### 3. Composition Root

**Định nghĩa**: Một điểm duy nhất trong ứng dụng nơi tất cả dependencies được "wire" (kết nối) lại với nhau. Đây là nơi duy nhất biết về tất cả concrete implementations.

**Ở đâu trong dự án**: Mỗi module có một Composition Root riêng nằm trong `hooks/*.use-cases.ts`.

**Code**:

```typescript
// src/modules/roles_permissions/roles/hooks/roles.use-cases.ts
export const rolesUseCases = new RolesUseCases(
  rolesApiGateway,     // ← concrete HTTP adapter
  currentUserAdapter   // ← concrete Zustand adapter
);

// src/modules/users/hooks/users.use-cases.ts
export const usersUseCases = new UsersUseCases(
  usersApiGateway,
  currentUserAdapter
);

// src/modules/employees/hooks/employees.use-cases.ts
export const employeesUseCases = new EmployeesUseCases(
  employeesApiGateway,
  currentUserAdapter
);
```

**Trong test, Composition Root được thay thế bằng mock**:

```typescript
// Ví dụ trong test file
const mockApi: IRolesPort = {
  listRoles: vi.fn().mockResolvedValue({ data: [], meta: {...} }),
  createRole: vi.fn().mockResolvedValue({ id: "1", name: "Admin" }),
  // ...
};
const mockCurrentUser: ICurrentUserPort = {
  getPermissions: () => ["roles.manage"],
  getUserId: () => "user-1",
};

// Composition Root trong test — inject mock
const rolesUseCases = new RolesUseCases(mockApi, mockCurrentUser);
```

**Pattern flow**:

```
Composition Root (roles.use-cases.ts)
    ├── new RolesUseCases(
    │       rolesApiGateway,       ──▶ RolesApiGateway (implements IRolesPort)
    │       currentUserAdapter     ──▶ CurrentUserAdapter (implements ICurrentUserPort)
    │   )
    │
    └── export rolesUseCases  ──▶ Hooks dùng trực tiếp: rolesUseCases.getList()
```

---

## Nhóm 2 — GoF Behavioral Patterns

---

### 4. Strategy

**Định nghĩa**: Định nghĩa một gia đình thuật toán, đóng gói từng cái, và làm chúng hoán đổi cho nhau. Strategy cho phép thuật toán thay đổi độc lập với client sử dụng nó.

**Ở đâu trong dự án**: `ICurrentUserPort` là một Strategy được inject vào `*UseCases`. Use Cases gọi `getPermissions()` mà không quan tâm implementation là Zustand, mock, hay bất cứ thứ gì.

**Code**:

```typescript
// src/modules/users/_usecases/users.usecases.ts
export class UsersUseCases {
  private readonly currentUser: ICurrentUserPort | null; // ← Strategy interface

  constructor(api: IUsersPort, currentUser: ICurrentUserPort | null = null) {
    this.currentUser = currentUser; // ← Strategy được inject từ ngoài
  }

  private requirePermission(permission: string): void {
    if (!this.currentUser) return;
    const permissions = this.currentUser.getPermissions(); // ← gọi Strategy
    if (!permissions.includes(permission)) {
      throw new ForbiddenError("errors.forbidden");
    }
  }
}
```

**Các concrete strategies**:

```typescript
// Strategy 1: Đọc từ Zustand (production)
export class CurrentUserAdapter implements ICurrentUserPort {
  getPermissions(): string[] {
    return useAuthStore.getState().permissions;
  }
}

// Strategy 2: Mock (testing)
const mockCurrentUser: ICurrentUserPort = {
  getPermissions: () => ["users.manage", "roles.manage"],
  getUserId: () => "test-user-id",
};

// Strategy 3: Không có quyền (testing forbidden scenarios)
const noPermissionsUser: ICurrentUserPort = {
  getPermissions: () => [],
  getUserId: () => "user-without-perms",
};
```

**Lợi ích**: Thay đổi cách lấy permissions (ví dụ: từ JWT decode thay vì Zustand) chỉ cần viết `JwtCurrentUserAdapter` implements `ICurrentUserPort`, không đụng vào `UseCases`.

---

### 5. Template Method

**Định nghĩa**: Định nghĩa skeleton của một thuật toán trong một method, trì hoãn một số bước cho subclasses (hoặc trong trường hợp này, các method reuse). Template Method cho phép subclasses redefine các bước nhất định mà không thay đổi cấu trúc thuật toán.

**Ở đâu trong dự án**: `requirePermission()` là một private template step được gọi đầu tiên trong mọi mutating method (`create`, `update`, `delete`). Đây là fixed skeleton: "kiểm tra quyền → xử lý logic → trả kết quả".

**Code**:

```typescript
// src/modules/users/_usecases/users.usecases.ts
export class UsersUseCases {

  // Template step — được tái sử dụng ở nhiều nơi
  private requirePermission(permission: string): void {
    if (!this.currentUser) return;
    const permissions = this.currentUser.getPermissions();
    if (!permissions.includes(permission)) {
      throw new ForbiddenError("errors.forbidden");
    }
  }

  // Skeleton: Step 1 (auth) → Step 2 (validate) → Step 3 (map) → Step 4 (call) → Step 5 (map)
  async create(formData: CreateUserSchema & { tenantId: string }): Promise<User> {
    this.requirePermission(PERMISSION_CODES.users.manage);  // ← template step (cố định)
    const { tenantId, ...rest } = formData;
    const validated = createUserSchema.parse(rest);
    const processed = { ...validated, username: validated.username.toLowerCase(), tenantId };
    const request = mapCreateUserFormToApi(processed);
    const response = await this.api.createUser(request);
    return mapUserProfileToUser(response);
  }

  async update(userId: string, formData: Partial<UpdateUserSchema>): Promise<User> {
    this.requirePermission(PERMISSION_CODES.users.manage);  // ← template step (cố định)
    const cleaned = pickBy(formData, (v): v is NonNullable<typeof v> => v !== undefined);
    const payload = mapUpdateUserFormToApi(userId, cleaned);
    const response = await this.api.updateUser(payload);
    return mapUserProfileToUser(response);
  }

  async delete(userId: string): Promise<void> {
    this.requirePermission(PERMISSION_CODES.users.manage);  // ← template step (cố định)
    if (!userId) throw new NotFoundError("errors.notFound");
    await this.api.deleteUser(userId);
  }
}
```

**Template cố định**:

```
Mọi mutating operation đều theo skeleton:
  [1] requirePermission()   ← bắt buộc, luôn đầu tiên
  [2] validate()            ← Zod schema parse
  [3] map()                 ← FormData → API DTO
  [4] api.call()            ← gọi Port
  [5] map()                 ← Response DTO → Domain Model
```

---

### 6. Observer

**Định nghĩa**: Định nghĩa một mối quan hệ one-to-many giữa các objects, sao cho khi một object thay đổi state, tất cả dependents của nó được thông báo và cập nhật tự động.

**Ở đâu trong dự án**: Zustand stores là Observable. Mọi component/hook "subscribe" vào store (bằng cách gọi `useStore(selector)`) sẽ tự động re-render khi phần state đó thay đổi.

**Code**:

```typescript
// Observable (Subject)
// src/@core/modal/store/modal.store.ts
export const useModalStore = create<ModalState>()((set) => ({
  registry: {},
  stack: [],           // ← observers sẽ react khi stack thay đổi

  open: (type, payload = null) => set((s) => ({ ...s, stack: [...s.stack, { type, payload }] })),
  close: (type) => set((s) => ({ ...s, stack: [...s.stack].slice(0, -1) })),
  register: (modals) => set((s) => ({ registry: { ...s.registry, ...modals } })),
  unregister: (modals) => set((s) => { /* remove keys */ }),
}));

// Observer 1: ModalEngine — re-renders mỗi khi stack thay đổi
const ModalEngine = () => {
  const { stack, registry } = useModalStore(); // ← subscribe toàn bộ
  return stack.map(modal => { /* render */ });
};

// Observer 2: useModalController — chỉ subscribe actions, không re-render
export function useModalController() {
  const open = useModalStore((s) => s.open);   // ← selector subscription
  const close = useModalStore((s) => s.close);
  return { open, close, edit, create };
}
```

**Zustand selector pattern** (fine-grained subscription — tránh re-render không cần thiết):

```typescript
// ❌ Subscribe toàn bộ store → re-render khi bất kỳ gì thay đổi
const store = useModalStore();

// ✅ Subscribe chỉ phần cần → re-render chỉ khi open/close thay đổi
const open = useModalStore((s) => s.open);
const close = useModalStore((s) => s.close);
```

---

### 7. Chain of Responsibility (Error Hierarchy)

**Định nghĩa**: Cho phép nhiều objects có cơ hội xử lý request. Chain các objects nhận request lại và truyền request dọc chain cho đến khi một object xử lý nó.

**Ở đâu trong dự án**: Error hierarchy `AppError → ForbiddenError / NotFoundError / ValidationError`. Use Cases throw specific errors, hooks catch và xử lý theo từng loại. Error "đi qua chain" từ Use Cases → hooks → UI.

**Code — Error hierarchy**:

```typescript
// src/shared/errors/app.errors.ts
export type AppErrorCode = "FORBIDDEN" | "NOT_FOUND" | "VALIDATION" | "UNKNOWN";

// Base — chứa code để phân biệt loại
export class AppError extends Error {
  readonly code: AppErrorCode;
  constructor(message: string, code: AppErrorCode = "UNKNOWN") {
    super(message);
    this.name = "AppError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Specific errors — carry thêm context
export class ForbiddenError extends AppError {
  readonly messageKey: string;
  constructor(messageKey = "errors.forbidden") {
    super(messageKey, "FORBIDDEN");
    this.name = "ForbiddenError";
    this.messageKey = messageKey;
  }
}

export class NotFoundError extends AppError {
  readonly messageKey: string;
  constructor(messageKey = "errors.notFound") {
    super(messageKey, "NOT_FOUND");
    this.name = "NotFoundError";
    this.messageKey = messageKey;
  }
}

export class ValidationError extends AppError {
  readonly field?: string;
  constructor(message: string, field?: string) {
    super(message, "VALIDATION");
    this.name = "ValidationError";
    this.field = field;
  }
}
```

**Code — Use Case throw, Hook catch và xử lý theo loại**:

```typescript
// Use Case throw specific error
async create(formData: CreateRoleSchema): Promise<RoleItem> {
  if (!canCreateRole(this.getPermissions()))
    throw new ForbiddenError("Bạn không có quyền tạo vai trò"); // ← throw vào chain
  // ...
}

// Hook xử lý từng loại error trong onError
useMutation({
  mutationFn: (formData) => rolesUseCases.create(formData),
  onError: (error) => {
    if (error instanceof ForbiddenError) {
      toast.error(t(error.messageKey));   // ← hiện thông báo quyền
      return;
    }
    if (error instanceof ValidationError) {
      form.setError(error.field, { message: error.message }); // ← highlight field
      return;
    }
    toast.error("Đã xảy ra lỗi không xác định"); // ← fallback
  }
});
```

**Chain flow**:

```
Use Case          Hook               UI
  │                │                  │
  │ throw          │                  │
  │ ForbiddenError ──▶ catch ──▶ toast.error("Không có quyền")
  │                │                  │
  │ throw          │                  │
  │ NotFoundError  ──▶ catch ──▶ navigate("/404")
  │                │                  │
  │ throw          │                  │
  │ ValidationError──▶ catch ──▶ form.setError(field)
  │                │                  │
  │ throw          │                  │
  │ AppError       ──▶ catch ──▶ toast.error("Lỗi không xác định")
```

---

### 8. Interceptor

**Định nghĩa**: Cho phép thêm hành vi vào trước/sau một operation mà không thay đổi operation đó. Middleware chain xử lý request/response theo thứ tự.

**Ở đâu trong dự án**: Axios interceptors trong `@core/axios/index.ts` — request interceptor attach Bearer token, response interceptor handle 401 và auto token refresh.

**Code — Request Interceptor (attach token)**:

```typescript
// src/@core/axios/index.ts
axiosInstance.interceptors.request.use((config) => {
  const skipAuth = config._skipAuth;
  if (skipAuth) return config;  // ← bypass cho refresh-token request

  const token = getAccessToken(); // ← đọc từ cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ← inject vào mọi request
  }
  return config;
});
```

**Code — Response Interceptor (auto token refresh)**:

```typescript
// Pattern quan trọng: chống race condition khi nhiều request cùng lúc nhận 401
let refreshPromise: Promise<...> | null = null; // ← shared promise

axiosInstance.interceptors.response.use(
  response => response, // ← pass-through nếu thành công
  async error => {
    const config = error.config;
    if (!config || error.response?.status !== 401) return Promise.reject(error);
    if (isRefreshRequest(config) || config._retried) return Promise.reject(error);

    // Nếu đang refresh rồi thì dùng chung promise — tránh gọi refresh nhiều lần
    refreshPromise = refreshPromise ?? doRefresh();
    const tokens = await refreshPromise;
    if (!tokens) return Promise.reject(error);

    // Retry request gốc với token mới
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    config._retried = true;      // ← đánh dấu đã retry, tránh vòng lặp vô hạn
    return axiosInstance.request(config);
  }
);
```

**Chain flow**:

```
Request  ──▶ [Interceptor 1: Attach Bearer Token] ──▶ HTTP Call
Response ◀──                                       ◀──
  ├── 2xx: pass-through ──▶ caller nhận data
  └── 401: [Interceptor 2: Refresh Token] ──▶ Retry với token mới
             ├── Refresh OK ──▶ Original request tiếp tục
             └── Refresh Fail ──▶ reject(error) ──▶ AuthGuard redirect login
```

---

## Nhóm 3 — GoF Structural / Creational Patterns

---

### 9. Data Mapper

**Định nghĩa**: Một lớp trung gian chuyển đổi dữ liệu giữa hai representations khác nhau (ví dụ DTO ↔ Domain Model), giữ cho mỗi bên độc lập với bên kia.

**Ở đâu trong dự án**: Tất cả các file `*mappers.ts` trong `_usecases/` layer.

**Code — Employee Mapper (có tạo computed fields)**:

```typescript
// src/modules/employees/_usecases/employees.mappers.ts

// DTO từ API: chỉ có raw data
// EmployeeProfile = { firstName, lastName, status, workMode, gender, ... }

// Domain Model: có thêm computed fields cho UI
// Employee = EmployeeProfile + { fullName, displayStatus, displayWorkMode, displayGender }

export function mapEmployeeProfileToEmployee(profile: EmployeeProfile): Employee {
  return {
    ...profile,
    // Computed fields — UI không cần biết logic ghép tên hay STATUS_LABELS
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    displayStatus: STATUS_LABELS[profile.status] ?? profile.status,      // "active" → "Đang làm việc"
    displayWorkMode: profile.workMode ? WORK_MODE_LABELS[profile.workMode] : "-",
    displayGender: GENDER_LABELS[profile.gender ?? "prefer_not_to_say"], // "male" → "Nam"
  };
}
```

**Code — Role Mapper (normalize optional fields)**:

```typescript
// src/modules/roles_permissions/_usecases/roles/roles.mappers.ts

// DTO → Domain: normalize nullish, set defaults
export function mapRoleDtoToDomain(dto: Role): RoleItem {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    description: dto.description ?? null,    // ← normalize undefined → null
    isSystem: dto.isSystem,
    permissionCount: dto.permissionCount ?? 0, // ← default nếu undefined
    permissions: undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// Form → API DTO: trim, format, reshape
export function mapCreateRoleFormToApi(form: CreateRoleSchema): RoleCreateRequest {
  return {
    name: form.name.trim(),                      // ← sanitize
    description: form.description?.trim() || null, // ← normalize empty string
    permissionIds: form.permissionIds ?? [],      // ← default array
  };
}

// Filters Domain → API Params: loại bỏ giá trị rỗng
export function mapFiltersToRoleListRequest(filters: RolesFiltersSchema): RoleListRequest {
  const result: RoleListRequest = {};
  if (filters.page != null) result.page = filters.page;
  if (filters.pageSize != null) result.pageSize = filters.pageSize;
  if (filters.search != null && filters.search !== "") result.search = filters.search;
  return result;
}
```

**Các loại mapper trong dự án**:

| Mapper function | Direction | Mục đích |
|----------------|-----------|----------|
| `mapRoleDtoToDomain()` | DTO → Domain | Normalize, set defaults |
| `mapEmployeeProfileToEmployee()` | DTO → Domain | Tạo computed fields cho UI |
| `mapCreateRoleFormToApi()` | Form → DTO | Sanitize, reshape cho API |
| `mapUpdateRoleFormToApi()` | Form → DTO | Patch payload với roleId |
| `mapFiltersToRoleListRequest()` | Domain → DTO | Loại bỏ fields rỗng |

**Lợi ích**: Khi API thay đổi field name (`firstName` → `first_name`), chỉ mapper cần cập nhật. UI, Domain, và tests không bị ảnh hưởng.

---

### 10. Registry

**Định nghĩa**: Một object lưu trữ ánh xạ `key → object`, cho phép tra cứu và lấy object theo key. Đây là dạng "bảng tra cứu" toàn cục.

**Ở đâu trong dự án**: Modal System — `modal.registry.tsx` ánh xạ `string key → React Component`. `ModalEngine` tra cứu registry và render component tương ứng.

**Code — Modal Registry (bảng ánh xạ)**:

```typescript
// src/modules/roles_permissions/roles/modals/roles.modal.registry.tsx

// Keys (type-safe constants)
export const RolesModalKeys = {
  CreateRoleModal: "CreateRoleModal",
  UpdateRoleModal: "UpdateRoleModal",
  RolePermissionsModal: "RolePermissionsModal",
} as const;

// Registry (ánh xạ key → component)
const rolesModalRegistry = {
  [RolesModalKeys.CreateRoleModal]: CreateRoleModal,
  [RolesModalKeys.UpdateRoleModal]: UpdateRoleModal,
  [RolesModalKeys.RolePermissionsModal]: RolePermissionsModal,
};

export default rolesModalRegistry;
```

**Code — Zustand Store (lưu registry toàn cục)**:

```typescript
// src/@core/modal/store/modal.store.ts
export const useModalStore = create<ModalState>()((set) => ({
  registry: {},   // ← Registry sống ở đây
  stack: [],      // ← Danh sách modals đang mở

  // Đăng ký modals vào registry
  register: (modals) => set((s) => ({ registry: { ...s.registry, ...modals } })),

  // Xóa khỏi registry khi unmount
  unregister: (modals) => set((s) => {
    const registry = { ...s.registry };
    for (const key of Object.keys(modals)) delete registry[key];
    return { registry };
  }),
}));
```

**Code — ModalEngine (consumer của Registry)**:

```typescript
// src/@core/modal/ModalEngine.tsx
const ModalEngine = memo(() => {
  const { stack, registry } = useModalStore();
  if (!stack.length) return null;

  return (
    <>
      {stack.map((modal, index) => {
        const Component = registry[modal.type] as React.ComponentType<...>;
        // ↑ tra cứu registry theo key
        if (!Component) return null;
        return <Component key={index} type={modal.type} payload={modal.payload} />;
      })}
    </>
  );
});
```

**Code — Lifecycle: register khi mount, unregister khi unmount**:

```typescript
// src/@core/modal/hooks/useRegisterModals.ts
export function useRegisterModals(registryObj: Record<string, any>) {
  const register = useModalStore((s) => s.register);
  const unregister = useModalStore((s) => s.unregister);

  useEffect(() => {
    register(registryObj);         // ← mount: thêm vào registry
    return () => unregister(registryObj); // ← unmount: dọn dẹp
  }, []);
}

// Dùng trong Page
export default function RolesManagementPage() {
  useRegisterModals(rolesModalRegistry); // ← đăng ký khi page mount
  // ...
}
```

**Flow hoàn chỉnh**:

```
Page mount
  → useRegisterModals({ CreateRoleModal: <Component> })
  → registry["CreateRoleModal"] = CreateRoleModal

User click "Thêm vai trò"
  → open("CreateRoleModal")
  → stack = [{ type: "CreateRoleModal", payload: null }]

ModalEngine re-renders
  → registry["CreateRoleModal"] // ← tra cứu
  → <CreateRoleModal type="CreateRoleModal" payload={null} />

User đóng modal
  → close("CreateRoleModal")
  → stack = []

Page unmount
  → unregister({ CreateRoleModal: ... })
  → registry = {} (cleaned up)
```

---

## Nhóm 4 — React-specific Patterns

---

### 11. Query Key Factory

**Định nghĩa**: Tổ chức React Query cache keys thành một factory object với hierarchy rõ ràng. Cho phép invalidate cache một cách chính xác — có thể invalidate toàn bộ một feature, một loại list, hay chỉ một item cụ thể.

**Ở đâu trong dự án**: Mọi hook file có `useQuery` đều có Query Key Factory tương ứng.

**Code**:

```typescript
// src/modules/roles_permissions/roles/hooks/useRolesList.ts
export const RolesKeys = {
  all: ["roles"] as const,                                         // ← toàn bộ roles
  lists: () => [...RolesKeys.all, "list"] as const,                // ← mọi danh sách
  list: (filters: RolesFilters) => [...RolesKeys.lists(), filters] as const, // ← danh sách với filter cụ thể
};

export function useRolesList(filters: RolesFilters) {
  return useQuery({
    queryKey: RolesKeys.list(filters), // ← ["roles", "list", { page: 1, search: "" }]
    queryFn: () => rolesUseCases.getList(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
```

**Key hierarchy**:

```
["roles"]                          ← RolesKeys.all       (invalidate MỌI thứ liên quan roles)
  └── ["roles", "list"]            ← RolesKeys.lists()   (invalidate MỌI danh sách)
        └── ["roles", "list", {}]  ← RolesKeys.list({})  (invalidate chỉ danh sách với filter này)
```

**Dùng khi invalidate sau mutation**:

```typescript
// src/modules/roles_permissions/roles/hooks/useCreateRoleMutation.ts
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateRoleSchema) => rolesUseCases.create(formData),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      // Invalidate MỌI danh sách roles (bất kể filter nào)
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
```

**Tại sao không dùng string thô**:

```typescript
// ❌ Magic strings — dễ typo, không type-safe
queryKey: ["roles", "list", filters]
invalidateQueries({ queryKey: ["roles", "list"] }) // sai thì không biết ngay

// ✅ Factory — type-safe, refactor-safe, centralized
queryKey: RolesKeys.list(filters)
invalidateQueries({ queryKey: RolesKeys.lists() })
```

---

### 12. Guard Pattern

**Định nghĩa**: Một wrapper component kiểm tra điều kiện trước khi cho phép render children. Nếu không thỏa điều kiện, redirect hoặc hiển thị fallback.

**Ở đâu trong dự án**: `AuthGuard` bảo vệ toàn bộ private routes.

**Code**:

```typescript
// src/@core/guards/AuthGuard.tsx
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useGetAuthMe(); // ← kiểm tra session

  // Sync user data vào Zustand store
  useEffect(() => {
    if (data) syncAuthFromUserProfile(data);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;  // ← chờ kiểm tra

  if (error) return <Navigate to="/auth/login" replace />; // ← chặn, redirect

  return children; // ← pass-through nếu authenticated
};
```

**Dùng trong route config**:

```typescript
// PrivateLayout bao toàn bộ private routes
const PrivateLayout = () => (
  <AuthGuard>        {/* ← Guard bọc ngoài cùng */}
    <Drawer />
    <Header />
    <Outlet />       {/* ← Chỉ render khi Guard pass */}
  </AuthGuard>
);
```

**Guard flow**:

```
Request vào private route
  → AuthGuard checks useGetAuthMe()
  ├── isLoading: true  → hiển thị loading spinner
  ├── error            → Navigate("/auth/login") — user không thể vào
  └── data             → render children — user được vào
```

---

### 13. Compound Component

**Định nghĩa**: Một component cha cung cấp context/state, các component con được attach như static properties của cha, chia sẻ state đó một cách ẩn tàng.

**Ở đâu trong dự án**: `ManagementLayout` với `ManagementLayout.Header` và `ManagementLayout.Filters` là static sub-components.

**Code**:

```typescript
// src/shared/layouts/ManagementLayout.tsx
const ManagementLayoutContext = createContext({});

// Parent component — quản lý shared state
const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <ManagementLayoutContext.Provider value={{ filters, setFilters, selectedItems, setSelectedItems }}>
      {children}
    </ManagementLayoutContext.Provider>
  );
};

// Sub-components — attach như static properties
ManagementLayout.Header = function Header() {
  return <div>Header</div>;
};

ManagementLayout.Filters = function Filters() {
  return <div>Filters</div>;
};

export default ManagementLayout;
```

**Cách dùng**:

```typescript
// Page dùng compound component
<ManagementLayout>
  <ManagementLayout.Header />   {/* ← sub-component, share context */}
  <ManagementLayout.Filters />  {/* ← sub-component, share context */}
  <Table />
</ManagementLayout>
```

**Lợi ích**: API gọn, ràng buộc tường minh giữa parent và sub-components, không cần truyền props qua nhiều tầng.

---

## Tổng hợp

| # | Pattern | Nhóm | Vị trí trong dự án | Mục đích |
|---|---------|-------|---------------------|----------|
| 1 | **Dependency Inversion** | Architectural | `*UseCases → I*Port ← *ApiGateway` | Tách Use Cases khỏi Infrastructure |
| 2 | **Port & Adapter** | Architectural | `_usecases/*.port.ts` / `_api/*.api.ts` | Core độc lập với HTTP và framework |
| 3 | **Composition Root** | Architectural | `hooks/*.use-cases.ts` | Điểm duy nhất wire dependencies |
| 4 | **Strategy** | GoF Behavioral | `ICurrentUserPort` inject vào UseCases | Thay đổi cách lấy permissions |
| 5 | **Template Method** | GoF Behavioral | `requirePermission()` trong UseCases | Skeleton cố định cho mọi mutation |
| 6 | **Observer** | GoF Behavioral | Zustand stores | Re-render tự động khi state thay đổi |
| 7 | **Chain of Responsibility** | GoF Behavioral | `AppError → ForbiddenError / NotFoundError` | Phân loại lỗi, xử lý theo tầng |
| 8 | **Interceptor** | GoF Behavioral | `@core/axios` interceptors | Token injection, auto-refresh |
| 9 | **Data Mapper** | GoF Structural | `_usecases/*mappers.ts` | DTO ↔ Domain, computed fields |
| 10 | **Registry** | GoF Creational | Modal registry + ModalEngine | Dynamic component lookup |
| 11 | **Query Key Factory** | React | `RolesKeys`, `UsersKeys` trong hooks | Type-safe cache invalidation |
| 12 | **Guard** | React | `AuthGuard.tsx` | Bảo vệ private routes |
| 13 | **Compound Component** | React | `ManagementLayout.*` | Shared state giữa sub-components |

---

## Tài liệu liên quan

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Tổng quan kiến trúc dự án
- [CLEAN_ARCHITECTURE_DEEP_DIVE.md](./CLEAN_ARCHITECTURE_DEEP_DIVE.md) — Luồng đi từ Infrastructure → Domain
- [DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md) — Quy tắc import giữa các layers
