You are a senior enterprise system architect with 15+ years of experience designing HRM, ERP, and SaaS multi-tenant systems for medium and large companies.

I want to design a production-grade HRM SaaS system that can be sold to companies.

The company structure includes:

- CEO
- Co-founder
- CTO
- PM
- Tech Lead (multiple)
- BA Lead
- Tester Lead
- Developers
- Testers
- Business Analysts

The system must support real-world enterprise workflows and must be designed for scalability, SaaS multi-tenant architecture, and API-first development using OpenAPI.

Please design the system in extreme detail following this structure:

---

## 1️⃣ SYSTEM ARCHITECTURE (HIGH LEVEL)

- Multi-tenant architecture design (Tenant isolation model: shared DB with tenant_id vs separate DB per tenant)
- RBAC (Role-based access control)
- Organization hierarchy design (Company → Business Units (BU1, BU2...) → Departments → Teams)
- Microservices vs Modular Monolith comparison and recommendation
- Event-driven capabilities
- Audit log system
- Notification system
- Scalability strategy
- SaaS subscription tiers design

---

## 2️⃣ DOMAIN DESIGN (DDD-BASED)

Break the system into bounded contexts:

- Identity & Access Management
- Organization Management
- Employee Management
- Attendance & Timesheet
- Payroll
- Project Management
- Performance Review
- Leave Management
- Recruitment (optional extension)
- Reporting & Analytics

For each bounded context:

- Entities
- Value Objects
- Aggregates
- Domain events
- Business rules
- Validation logic
- State transitions

---

## 3️⃣ DATABASE DESIGN

Design relational schema (PostgreSQL optimized):

Tables:

- tenants
- users
- roles
- permissions
- organizations
- departments
- teams
- employees
- contracts
- salary_components
- payroll_cycles
- payroll_records
- attendance_records
- timesheets
- leave_requests
- projects
- project_members
- tasks
- task_status_history
- performance_reviews
- audit_logs

Include:

- Primary keys
- Foreign keys
- Index strategy
- Multi-tenant isolation (tenant_id)
- Soft delete strategy
- Audit fields (created_at, updated_at, created_by)

---

## 4️⃣ PAYROLL SYSTEM (REALISTIC)

Design payroll system that supports:

- Base salary
- Allowances
- Overtime calculation
- Deductions
- Tax calculation
- Social insurance
- Configurable salary formula
- Payroll approval workflow
- Payroll locking after approval
- Payslip generation

Include:

- Payroll processing flow
- Salary formula engine design
- Approval hierarchy

---

## 5️⃣ ATTENDANCE SYSTEM

- Check-in / check-out
- Remote vs office mode
- GPS verification (optional)
- Manual correction request
- Approval workflow
- Integration with payroll

---

## 6️⃣ PROJECT & RESOURCE MANAGEMENT

- Project lifecycle
- Project roles
- Resource allocation
- Timesheet tracking
- Budget tracking
- Project progress reporting
- PM dashboard

---

## 7️⃣ RBAC & PERMISSION MODEL

Design a flexible permission system:

- Role templates
- Custom roles per tenant
- Fine-grained permission (e.g., payroll.view.own, payroll.view.all)
- Hierarchical permission
- Field-level permission (optional advanced)

---

## 8️⃣ OPENAPI DESIGN

Generate full REST API structure:

- Auth APIs
- Employee APIs
- Attendance APIs
- Payroll APIs
- Project APIs
- Reporting APIs

For each:

- Endpoint
- Request schema
- Response schema
- Validation rules
- Error handling
- Pagination format
- Filtering format

---

## 9️⃣ SAAS FEATURES

- Subscription plans
- Usage-based billing
- Feature flags
- Tenant onboarding flow
- Tenant admin dashboard
- White-label support

---

## 🔟 NON-FUNCTIONAL REQUIREMENTS

- Security (JWT, refresh token, rotation)
- Data encryption
- Logging
- Monitoring
- Rate limiting
- GDPR compliance
- Backup & recovery
- High availability

---

## 1️⃣1️⃣ TECH STACK SUGGESTION

Provide recommended stack:

Backend:

- Language
- Framework
- ORM
- Message queue
- Cache
- DB
- API documentation

Frontend:

- Architecture pattern
- State management
- Permission guard strategy

DevOps:

- CI/CD
- Containerization
- Cloud deployment
- Multi-environment setup

---

IMPORTANT:
Design this system to be production-grade, scalable, and sellable as SaaS.
Follow best practices used in enterprise HRM systems like Workday, BambooHR, or Odoo.
Avoid toy examples.
Be extremely detailed and structured.
