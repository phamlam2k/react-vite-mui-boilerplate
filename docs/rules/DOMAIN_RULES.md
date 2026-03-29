# Domain Layer Guideline for AI Agents

## Mục tiêu

Tài liệu này hướng dẫn AI Agents cách xác định:

- Cái gì thuộc `Domain`
- Cái gì không thuộc `Domain`
- Cách refactor code để giữ đúng ranh giới kiến trúc

Tài liệu này áp dụng cho dự án React / Next.js theo hướng Clean Architecture hoặc Hybrid Architecture.

---

# 1. Domain là gì?

`Domain` là nơi chứa:

- Business rules
- Business policies
- Invariants
- Domain entities
- Value objects
- Domain services
- Repository contracts (interfaces)

Domain mô tả:

- Hệ thống là gì
- Quy tắc nghiệp vụ là gì
- Điều gì luôn phải đúng trong business

Domain **không quan tâm**:

- UI
- React
- Next.js
- API client
- Database implementation
- Debounce
- Pagination UI
- Display labels
- Translation / i18n

---

# 2. Quy tắc nhận biết một logic có thuộc Domain hay không

Một đoạn code thuộc Domain nếu:

1. Nó là quy tắc nghiệp vụ thật sự
2. Nó vẫn đúng dù đổi framework
3. Nó vẫn đúng dù đổi database
4. Nó không phụ thuộc vào UI/presentation
5. Nó không phải chi tiết kỹ thuật triển khai

### Ví dụ thuộc Domain

- User có quyền tạo Organization hay không
- Tên Organization tối đa 100 ký tự
- Booking không được ở quá khứ
- Guest count không được vượt capacity
- Subscription free chỉ được tạo tối đa 3 booking mỗi tháng

### Ví dụ không thuộc Domain

- `SEARCH_DEBOUNCE_MS`
- `DEFAULT_PAGE_SIZE`
- label hiển thị `"Công ty"`
- React hook state
- axios/fetch call
- Prisma query
- toast message
- modal open/close state

---

# 3. Những thứ nên nằm trong Domain

## 3.1 Entities

Object nghiệp vụ chính có identity.

Ví dụ:

- `Organization`
- `Booking`
- `User`
- `Property`

## 3.2 Value Objects

Giá trị có invariant riêng.

Ví dụ:

- `Email`
- `Money`
- `TimeRange`
- `Capacity`
- `OrganizationCode`

## 3.3 Domain Policies / Rules

Các hàm kiểm tra rule nghiệp vụ.

Ví dụ:

- `canViewOrganization`
- `canCreateOrganization`
- `canDeleteOrganization`

## 3.4 Domain Constants / Invariants

Chỉ giữ các constant mang ý nghĩa nghiệp vụ.

Ví dụ:

- `ORG_NAME_MAX_LENGTH`
- `ORG_CODE_MAX_LENGTH`

## 3.5 Repository Interfaces

Chỉ là contract, không phải implementation.

Ví dụ:

- `OrganizationRepository`
- `BookingRepository`

## 3.6 Domain Errors

Lỗi nghiệp vụ rõ ràng.

Ví dụ:

- `OrganizationNameTooLongError`
- `BookingInPastError`
- `CapacityExceededError`

---

# 4. Những thứ không nên nằm trong Domain

## 4.1 Presentation / UI concerns

- display labels
- i18n text
- CSS/UI constants
- debounce
- modal state
- table column config

## 4.2 Application / workflow concerns

- pagination defaults
- search params parsing
- API response mapping
- screen-specific filtering behavior

## 4.3 Infrastructure concerns

- axios
- fetch
- Prisma
- SQL query
- localStorage
- cookies
- Redis client
- file upload implementation

---

# 5. Phân loại nhanh

## Thuộc Domain

```ts
export const ORG_NAME_MAX_LENGTH = 100;

export function canCreateOrganization(permissions: string[]): boolean {
  return permissions.includes("organization.manage");
}
```
