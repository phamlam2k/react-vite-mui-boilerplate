# Documentation

Tài liệu đầy đủ về kiến trúc và quy ước của dự án.

## 📚 Reading Order (cho người mới)

Đọc theo thứ tự sau để hiểu dự án trong 30 phút:

### 1. [Clean Architecture Summary](./CLEAN_ARCHITECTURE_SUMMARY.md) (5 phút)

**Bắt đầu từ đây!** ⭐

Tóm tắt ngắn gọn:
- 4 layers của Clean Architecture (🔵 Domain → 🟢 Use Cases → 🟡 Adapters → 🔴 Frameworks)
- Dependency rules
- Best practices với examples
- Common mistakes & fixes

**Đọc khi**: Mới tham gia team hoặc cần reference nhanh.

---

### 2. [Architecture Documentation](./ARCHITECTURE.md) (15 phút)

Tài liệu chi tiết với diagrams đầy đủ:
- Clean Architecture overview với Mermaid diagrams
- Mapping Clean Architecture → Project structure
- Layer chi tiết (Domain, Use Cases, Adapters, Frameworks)
- Data flow diagrams (API → UI, Menu generation, Auth, Modal)
- Use case examples (Fetch products, Create product)
- Testing strategy theo Clean Architecture
- Cross-cutting concerns (Logging, Error handling, Caching, Auth)

**Đọc khi**: Cần hiểu sâu về kiến trúc, data flow, hoặc testing strategy.

---

### 3. [Dependency Rules](./DEPENDENCY_RULES.md) (5 phút)

Chi tiết quy tắc import giữa các layers:
- Quick reference table
- Visual diagrams
- Examples: ✅ Allowed vs ❌ Not allowed
- Common violations với cách fix
- FAQ

**Đọc khi**: Trước khi code để tránh violations.

---

### 4. [Module Template](./MODULE_TEMPLATE.md) (5 phút)

Template đầy đủ cho feature mới:
- Structure chuẩn của một module
- Example: Products module với tất cả layers
  - Domain types
  - Use Cases (API, hooks, validators, mappers)
  - Adapters (components, pages)
- Testing structure
- Checklist khi tạo module

**Đọc khi**: Chuẩn bị tạo feature mới.

---

## 📂 Document Structure

```
docs/
├── README.md                           # File này - Index của tất cả docs
├── CLEAN_ARCHITECTURE_SUMMARY.md       # Tóm tắt (đọc đầu tiên)
├── ARCHITECTURE.md                     # Chi tiết đầy đủ với diagrams
├── DEPENDENCY_RULES.md                 # Quy tắc import
└── MODULE_TEMPLATE.md                  # Template tạo feature mới
```

---

## 🎯 Quick Links

### Khi bạn cần...

| Tình huống | Đọc file |
|------------|----------|
| Mới vào team, cần hiểu tổng quan | [Clean Architecture Summary](./CLEAN_ARCHITECTURE_SUMMARY.md) |
| Muốn hiểu sâu về layers và data flow | [Architecture](./ARCHITECTURE.md) |
| Không chắc import A có được import B không | [Dependency Rules](./DEPENDENCY_RULES.md) |
| Tạo feature mới, cần template | [Module Template](./MODULE_TEMPLATE.md) |
| Muốn xem testing strategy | [Architecture - Testing](./ARCHITECTURE.md#testing-strategy) |
| Cần hiểu cross-cutting concerns (logging, error) | [Architecture - Cross-Cutting](./ARCHITECTURE.md#cross-cutting-concerns) |

---

## 🔍 Tìm thông tin cụ thể

### Clean Architecture
- [4 Layers là gì?](./CLEAN_ARCHITECTURE_SUMMARY.md#-4-layers)
- [Dependency Rule](./CLEAN_ARCHITECTURE_SUMMARY.md#-dependency-flow)
- [Module structure theo Clean Architecture](./ARCHITECTURE.md#clean-architecture-trong-module)

### Project Structure
- [Folder structure tổng quan](./ARCHITECTURE.md#folder-structure)
- [Module structure chi tiết](./MODULE_TEMPLATE.md#structure)
- [Layer responsibilities](./ARCHITECTURE.md#layer-chi-tiết)

### Development
- [Thêm feature mới](./MODULE_TEMPLATE.md#example-products-module)
- [Testing strategy](./ARCHITECTURE.md#testing-strategy)
- [Best practices](./CLEAN_ARCHITECTURE_SUMMARY.md#-best-practices)

### Rules & Conventions
- [Import rules](./DEPENDENCY_RULES.md#quick-reference)
- [Common mistakes](./CLEAN_ARCHITECTURE_SUMMARY.md#-common-mistakes)
- [Violations & fixes](./DEPENDENCY_RULES.md#common-violations--fixes)

---

## 💡 Tips

### Cho người mới:
1. Đọc [CLEAN_ARCHITECTURE_SUMMARY.md](./CLEAN_ARCHITECTURE_SUMMARY.md) trước (5 phút)
2. Xem qua [ARCHITECTURE.md](./ARCHITECTURE.md) để biết có gì (skim 5 phút)
3. Đọc [DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md) trước khi code (5 phút)
4. Bookmark [MODULE_TEMPLATE.md](./MODULE_TEMPLATE.md) để reference khi cần

**Total: 15-20 phút** để sẵn sàng code!

### Cho senior/reviewer:
- Check [Dependency Rules](./DEPENDENCY_RULES.md) khi review PR
- Reference [Module Template](./MODULE_TEMPLATE.md) để đảm bảo consistency
- Dùng [Common Mistakes](./CLEAN_ARCHITECTURE_SUMMARY.md#-common-mistakes) làm checklist

---

## 🔄 Updates

Docs này được update khi:
- Có thay đổi lớn về kiến trúc
- Thêm convention mới
- Refactor dependencies
- Team feedback về clarity

Nếu thấy docs chưa rõ hoặc thiếu thông tin, tạo issue hoặc PR!

---

## 📖 External Resources

### Clean Architecture
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code Book](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

### Frontend Patterns
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Modular Monolith](https://martinfowler.com/articles/modular-monolith.html)

### Testing
- [Testing Library](https://testing-library.com/)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
- [MSW Documentation](https://mswjs.io/)

---

**Happy coding! 🚀**
