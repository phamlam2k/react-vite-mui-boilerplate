# Onion Diagram — Clean Architecture (Frontend)

Sơ đồ đồng tâm theo kiến trúc hiện tại: dependencies chỉ hướng **vào trong**.  
📋 **Shared Contract** (`_api/*.type.ts`) là type-only, mọi layer đều có thể import.

---

## 1. Onion rings (layers)

```
                    ┌─────────────────────────────────────────────────────────┐
                    │  🔴 INFRASTRUCTURE (outer)                               │
                    │  @core/  @themes/  shared/                               │
                    │  Axios, React, MUI, Zustand, OpenAPI, MSW                │
                    └───────────────────────────┬───────────────────────────────┘
                                                │ depends on
                    ┌───────────────────────────▼───────────────────────────────┐
                    │  🟡 INTERFACE ADAPTERS                                    │
                    │  Gateway (_api/*.api)  Hooks  Pages  Components  Modals   │
                    │  _routes/  routes/ (top-level)                           │
                    └───────────────────────────┬───────────────────────────────┘
                                                │ depends on
                    ┌───────────────────────────▼───────────────────────────────┐
                    │  🟢 USE CASES                                             │
                    │  _usecases/  —  Port (*.port.ts), validation, mapper      │
                    │  Pure: validate → map → call Port → map response          │
                    └───────────────────────────┬───────────────────────────────┘
                                                │ depends on
                    ┌───────────────────────────▼───────────────────────────────┐
                    │  🔵 DOMAIN (innermost)                                    │
                    │  _domain/  —  rules, models, domain functions             │
                    └─────────────────────────────────────────────────────────┘

                    ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐
                    │  📋 SHARED CONTRACT  _api/*.type.ts  (type-only)         │
                    │  Any layer may import — compile-time only, no runtime   │
                    └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘
```

---

## 2. Mermaid — Onion (flowchart)

```mermaid
flowchart TB
    subgraph INFRA["🔴 Infrastructure"]
        core["@core/"]
        themes["@themes/"]
        shared["shared/"]
    end

    subgraph ADAPTERS["🟡 Interface Adapters"]
        gateway["Gateway _api/*.api.ts"]
        hooks["hooks/"]
        pages["pages/"]
        components["components/"]
        modals["modals/"]
        routes["_routes/"]
        routesTop["routes/ (top)"]
    end

    subgraph USECASES["🟢 Use Cases"]
        port["Port *.port.ts"]
        validation["*.validation.ts"]
        mapper["*.mapper.ts"]
        usecase["*.usecase.ts"]
    end

    subgraph DOMAIN["🔵 Domain"]
        domainRules["*.rules.ts"]
        domainModel["*.model.ts"]
    end

    INFRA --> ADAPTERS
    ADAPTERS --> USECASES
    USECASES --> DOMAIN

    style DOMAIN fill:#e3f2fd
    style USECASES fill:#e8f5e9
    style ADAPTERS fill:#fff3e0
    style INFRA fill:#ffebee
```

---

## 3. Mermaid — Dependency rule (simplified)

```mermaid
flowchart LR
    subgraph Outer["🔴 Infra"]
        I["@core, @themes, shared"]
    end

    subgraph Adapters["🟡 Adapters"]
        A["Gateway, Hooks, Pages, Components, Modals, Routes"]
    end

    subgraph UseCases["🟢 Use Cases"]
        U["Port, validation, mapper, usecase"]
    end

    subgraph Inner["🔵 Domain"]
        D["rules, model"]
    end

    I --> A
    A --> U
    U --> D

    Contract["📋 Shared Contract\n_api/*.type.ts"]
    D -.->|"type only"| Contract
    U -.->|"type only"| Contract
    A -.->|"type only"| Contract
```

---

## 4. Per-module onion (e.g. roles_permissions)

```mermaid
flowchart TB
    subgraph Module["Module: roles_permissions"]
        subgraph Infra["🔴 Infrastructure (shared)"]
            core["@core/axios"]
        end

        subgraph Adapter["🟡 Adapters"]
            gateway["_api/roles/roles.api.ts\nimplements IRolesPort"]
            hooks["roles/hooks/"]
            pages["roles/pages/"]
            components["roles/components/"]
        end

        subgraph UC["🟢 Use Cases"]
            port["roles.port.ts\nIRolesPort"]
            listUC["list-roles.usecase.ts"]
            createUC["create-role.usecase.ts"]
        end

        subgraph Domain["🔵 Domain"]
            model["roles.model.ts"]
            rules["roles.rules.ts"]
        end
    end

    gateway -->|implements| port
    hooks -->|inject gateway| listUC
    listUC --> port
    listUC --> Domain
    port -.->|"import type"| contract["_api/roles/roles.type.ts"]

    Infra --> Adapter
    Adapter --> UC
    UC --> Domain
```

---

## 5. Golden rule (summary)

| Layer                         | May import from                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------- |
| 🔵 Domain                     | Domain (same module), Shared Contract (same module), shared                      |
| 🟢 Use Cases                  | Domain, Use Cases (same module), Shared Contract (same module), shared           |
| 🟡 Gateway                    | **Use Cases (Port)**, Shared Contract, core, shared                              |
| 🟡 Adapters (hooks, pages, …) | Domain, Use Cases, Gateway, Shared Contract, module-routes, core, themes, shared |
| 🔴 Infrastructure             | core, themes, shared                                                             |
| 📋 Shared Contract            | core (for type source)                                                           |

**Port pattern:** Use Case chỉ phụ thuộc **Port** (interface trong \_usecases). Gateway (outer) **implement** Port → dependency hướng vào trong. Adapter (hook) **inject** gateway khi gọi: `useCase(rolesApi, ...)`.
