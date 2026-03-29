# Use Case Unit Testing Guide

## Philosophy

Use case tests are the most important tests in this architecture.
They sit at the boundary between business logic and infrastructure — and that is exactly what they protect.

**A use case test answers one question:**
> _"Given these inputs and this user context, does the system behave correctly?"_

It does NOT answer:
> _"Does the HTTP request have the right headers?"_ → API test
> _"Does the button render correctly?"_ → Component test

---

## Core Principles

### 1. Test behavior, not implementation

```ts
// ❌ Wrong — tests internal wiring
expect(mapOrgDtoToDomain).toHaveBeenCalledWith(orgDto);

// ✅ Correct — tests observable output
expect(result).toMatchObject({ id: "org-1", code: null });
```

### 2. One concept per test

Each `it()` block should have one clear reason to fail.

```ts
// ❌ Wrong — two concepts in one test
it("blocks viewer and allows manager", async () => {
  await expect(uc.create(form)).rejects.toThrow(ForbiddenError); // viewer
  await expect(uc.create(form)).resolves.toBeDefined();           // manager
});

// ✅ Correct — one concept per test
it("throws ForbiddenError when user lacks manage permission", async () => { ... });
it("allows create when user has manage permission", async () => { ... });
```

**Exception:** When testing the same behavior across multiple inputs (guards, auth).
Grouping `null / "" / undefined` in one test is fine since they test the same concept.

### 3. Fake dependencies, never real ones

Use cases depend on ports (interfaces). Inject mocks — never real API clients, real HTTP, or real storage.

```ts
// ✅ Inject a mock that satisfies the interface
const api: IOrganizationsPort = {
  getList: vi.fn().mockResolvedValue({ data: [], meta }),
  create:  vi.fn().mockResolvedValue(orgDto),
  // ...
};
```

### 4. Test names describe the business scenario

Names should be readable by a non-developer.

```ts
// ❌ Technical
it("calls api.create with trimmed name")

// ✅ Business-readable
it("trims whitespace from name and code before saving")
```

### 5. Do not over-test happy paths, do not under-test edge cases

The happy path confirms the contract exists. The real value is in the edge cases.

---

## File Structure

```
_usecases/
  organizations.usecases.ts       ← subject under test
  organizations.usecases.spec.ts  ← test file (co-located)
```

### Test file anatomy

```ts
// 1. Imports
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationsUseCases } from "./organizations.usecases";
// ... error types, port interfaces, DTO types

// 2. Fixtures — shared, minimal, clearly named
const orgDto: OrgUnit = { ... };
const meta = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 };

// 3. User context factory functions
const asManager = (): ICurrentUserPort => ({ getPermissions: vi.fn().mockReturnValue(["org.manage"]) });
const asViewer  = (): ICurrentUserPort => ({ getPermissions: vi.fn().mockReturnValue(["org.view"]) });

// 4. describe("ClassName") — one per file
describe("OrganizationsUseCases", () => {

  // 5. beforeEach — reset the API mock
  let api: IOrganizationsPort;
  beforeEach(() => { api = { ... all methods as vi.fn() ... }; });

  // 6. describe("methodName") — one per use case method
  describe("create", () => { ... });
  describe("getList", () => { ... });

  // 7. Shared cross-cutting concerns at the bottom
  describe("authorization", () => { ... });
});
```

---

## What to Test per Use Case Method

Every use case method typically has these responsibilities.
Cover each one with at least one test.

### Query methods (getList, getById, getChildren)

| Responsibility | What to assert |
|---|---|
| Input forwarding | Correct params passed to `api.*` |
| Input filtering | Empty / "all" values stripped before API call |
| Input validation | Throws on invalid values (pageSize > max, empty id) |
| Output mapping | DTO optional fields normalized to `null` |
| Happy path | Returns domain model with expected shape |

### Mutation methods (create, update, delete)

| Responsibility | What to assert |
|---|---|
| Authorization — blocked | `ForbiddenError` thrown, `api.*` NOT called |
| Authorization — allowed | `api.*` called, result returned |
| Input sanitization | Trim, normalize empty strings to `undefined` |
| Input validation | Throws on invalid schema (empty name, wrong type) |
| API payload | Correct structure sent to `api.*` |
| Output mapping | Returned domain model has correct shape |

---

## Authorization Pattern

Authorization is cross-cutting. Test it in two places:

**1. Per-method:** confirm the specific method throws/blocks

```ts
describe("create", () => {
  it("throws ForbiddenError when user lacks manage permission", async () => {
    const uc = new OrganizationsUseCases(api, asViewer());
    await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
    expect(api.create).not.toHaveBeenCalled(); // ← never reaches API
  });
});
```

**2. Aggregated:** confirm the auth model is consistent across all mutations

```ts
describe("authorization", () => {
  it("null currentUser → skips auth check, all mutations pass", async () => {
    const uc = new OrganizationsUseCases(api, null);
    await expect(uc.create(form)).resolves.toBeDefined();
    await expect(uc.update("id", {})).resolves.toBeDefined();
    await expect(uc.delete("id")).resolves.toBeUndefined();
  });

  it("viewer → all mutations rejected with ForbiddenError", async () => {
    const uc = new OrganizationsUseCases(api, asViewer());
    await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
    await expect(uc.update("id", {})).rejects.toThrow(ForbiddenError);
    await expect(uc.delete("id")).rejects.toThrow(ForbiddenError);
  });
});
```

> **Do not repeat** the same viewer/no-permission case for every single method.
> Pick the minimal set that proves the authorization model is correct.

---

## Guard Pattern (ID Validation)

Empty ID guards are identical across methods. Test them concisely:

```ts
it("throws NotFoundError when orgId is empty", async () => {
  const uc = new OrganizationsUseCases(api, null);
  await expect(uc.getById("")).rejects.toThrow(NotFoundError);
  expect(api.getById).not.toHaveBeenCalled(); // ← short-circuits before API
});
```

**Do not** test `null`, `undefined`, and `""` as three separate tests.
They express the same concept: _"missing ID"_.

---

## Fixture Design Rules

### Keep fixtures minimal and purposeful

```ts
// ❌ Fixture with every field filled — hard to read, brittle
const orgDto = { id: "1", name: "X", type: "company", isActive: true, tenantId: "t", createdAt: "...", updatedAt: "...", parentId: "p", code: "C", description: "D", headEmployeeId: "h" };

// ✅ Fixture with realistic data, clearly structured
const orgDto: OrgUnit = {
  id: "org-1",
  name: "Phòng Kỹ thuật",
  type: "department",
  isActive: true,
  // optional fields present to test the full mapping
  parentId: "org-0",
  code: "ENG-001",
  // ...
};
```

### Use inline data for one-off overrides

```ts
// Do not create a new fixture constant for every variation
vi.mocked(api.getList).mockResolvedValueOnce({
  data: [{ id: "org-2", type: "company", isActive: true, /* minimal */ }],
  meta,
});
```

### Factory functions for user context

Prefer factory functions over constants so each test gets a fresh mock:

```ts
// ✅ Factory — fresh vi.fn() per test
const asManager = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["organization.manage"]),
  getUserId: vi.fn().mockReturnValue("user-1"),
});

// ❌ Constant — shared mock state across tests
const MANAGER: ICurrentUserPort = {
  getPermissions: vi.fn().mockReturnValue(["organization.manage"]),
};
```

---

## Naming Conventions

| Pattern | Example |
|---|---|
| Happy path | `"returns domain model for valid id"` |
| Auth blocked | `"throws ForbiddenError when user lacks manage permission"` |
| Guard | `"throws NotFoundError when orgId is empty"` |
| Validation | `"throws validation error when name is empty"` |
| Sanitization | `"trims whitespace from name before saving"` |
| Normalization | `"normalizes missing optional fields to null"` |
| Filter logic | `"strips empty/all filters — API does not receive unused params"` |
| Aggregate auth | `"viewer → all mutations rejected with ForbiddenError"` |

---

## Anti-patterns to Avoid

### ❌ Testing the mapper in isolation via the use case

```ts
// This tests the mapper, not the use case behavior
it("type 'company' is preserved in domain model", async () => {
  vi.mocked(api.getById).mockResolvedValueOnce({ ...orgDto, type: "company" });
  const result = await uc.getById("org-1");
  expect(result.type).toBe("company");
});
```

Mapper logic should be tested in its own `*.mappers.spec.ts` if complex.
In the use case test, one mapping test (`normalizes optional fields to null`) is enough.

### ❌ Asserting the exact error message string

```ts
// ❌ Brittle — breaks if someone tweaks the Vietnamese copy
await expect(uc.create(form)).rejects.toThrow("Bạn không có quyền tạo đơn vị tổ chức");

// ✅ Assert the error type — that is the contract
await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
```

### ❌ Calling the subject twice in one assertion

```ts
// ❌ Creates two method calls — mock call counts become unreliable
await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
await expect(uc.create(form)).rejects.toThrow("some message"); // second call

// ✅ Capture the error once
const error = await uc.create(form).catch(e => e);
expect(error).toBeInstanceOf(ForbiddenError);
```

### ❌ Using `any` or loose matchers everywhere

```ts
// ❌ Too loose — passes even with wrong structure
expect(result).toBeDefined();

// ✅ Assert the meaningful shape
expect(result).toMatchObject({ id: "org-1", type: "department" });
```

### ❌ `beforeAll` for mocks

```ts
// ❌ Shared state across tests — order-dependent, flaky
beforeAll(() => { api.create = vi.fn().mockResolvedValue(orgDto); });

// ✅ Fresh setup per test
beforeEach(() => { api = { create: vi.fn().mockResolvedValue(orgDto), ... }; });
```

---

## Scalability Checklist

When adding a new use case method, use this checklist:

```
Query method
  [ ] Forwards required params to api.*
  [ ] Strips optional/empty params before API call
  [ ] Throws on invalid input (empty id, out-of-range pagination)
  [ ] Maps DTO to domain correctly (especially null normalization)

Mutation method
  [ ] Blocked by insufficient permissions → ForbiddenError, api.* not called
  [ ] Allowed by correct permissions
  [ ] Sanitizes input (trim, empty string → undefined)
  [ ] Rejects invalid schema → throws before api.* is called
  [ ] Sends correct payload structure to api.*

Authorization (update aggregated test if adding new mutation)
  [ ] null user → mutation passes
  [ ] viewer → mutation blocked
```

---

## Test Count Target

| Use case method | Target tests |
|---|---|
| Query (getList, getById) | 3–4 |
| Mutation (create, update) | 4–5 |
| Simple mutation (delete) | 2–3 |
| Authorization (aggregated) | 2 |
| **Total for a CRUD module** | **~20–25** |

More tests than this is usually a sign of:
- Testing the mapper (move to `*.mappers.spec.ts`)
- Testing the same concept with different words
- Testing framework behavior instead of business behavior
