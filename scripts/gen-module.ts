/**
 * Generate Clean Architecture modules (single or nested).
 *
 * Case 1 - Single module:
 *   pnpm run gen:module products
 *   Creates: src/modules/products/ with _api, _domain, _usecases, _routes, pages, components, hooks, modals, i18n
 *
 * Case 2 - Nested module (sub-module under a parent):
 *   pnpm run gen:module roles_permissions permissions
 *   Creates: src/modules/roles_permissions/permissions/ and updates parent _routes if needed.
 *
 * Principles: SRP (one generator per layer), DRY (shared naming), consistent with existing modules.
 */

import * as fs from "fs";
import * as path from "path";

const MODULES_ROOT = path.join(process.cwd(), "src", "modules");

// --- Naming helpers (DRY) ---

function toPascal(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function toCamel(s: string): string {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

/** e.g. "users" -> "User", "products" -> "Product", "roles" -> "Role" */
function toEntityName(moduleKey: string): string {
  const base = moduleKey.split("_").pop() ?? moduleKey;
  if (base.endsWith("s") && base.length > 1) {
    return toPascal(base.slice(0, -1));
  }
  return toPascal(base);
}

/** e.g. "users" -> "users", "roles_permissions" -> "roles" when sub is "roles" */
function filePrefix(moduleKey: string): string {
  return moduleKey.split("_").pop() ?? moduleKey;
}

/** Path alias base: roles_permissions/roles -> @modules/roles_permissions/roles */
function modulePath(parent: string | null, moduleKey: string): string {
  return parent ? `${parent}/${moduleKey}` : moduleKey;
}

function alias(
  parent: string | null,
  moduleKey: string,
  ...segments: string[]
): string {
  const base = `@modules/${modulePath(parent, moduleKey)}`;
  return segments.length ? `${base}/${segments.join("/")}` : base;
}

// --- Case 1: Single module generators ---

function generateSingleModule(moduleKey: string): void {
  const entity = toEntityName(moduleKey);
  const entityVar = toCamel(entity);
  const prefix = filePrefix(moduleKey);
  const root = path.join(MODULES_ROOT, moduleKey);

  const w = (filePath: string, content: string) => {
    const full = path.join(root, filePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trimEnd() + "\n", "utf-8");
    console.log("  +", filePath);
  };

  console.log(`\n📁 Single module: ${moduleKey} (entity: ${entity})\n`);

  // _domain
  w(
    `_domain/${prefix}.model.ts`,
    `/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities, no framework dependencies
 */

import type { PaginatedResponse, PaginatedQueryParams } from "@shared/types/pagination.type";

export interface ${entity} {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ${entity}List = PaginatedResponse<${entity}>;

export interface ${entity}Filters extends PaginatedQueryParams {
  search?: string;
}
`
  );

  w(
    `_domain/${prefix}.rules.ts`,
    `/**
 * 🔵 DOMAIN LAYER - Business Rules
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 500;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";
`
  );

  // _api
  w(
    `_api/${prefix}.type.ts`,
    `import type { components } from "@core/api-contract/openapi";

// Re-export or define DTOs from OpenAPI, e.g.:
// export type ${entity}Profile = components["schemas"]["${entity}Profile"];
// export type ${entity}ListRequest = { page?: number; pageSize?: number; search?: string };
// export type ${entity}ListResponse = components["schemas"]["${entity}ListResponse"];
`
  );

  w(
    `_api/${prefix}.api.ts`,
    `import axiosInstance from "@core/axios";
import type { I${entity}Port } from "${alias(null, moduleKey, "_usecases", `${prefix}.port`)}";
// import type { ... } from "./${prefix}.type";

export const ${entity}ApiRoutes = {
  List: "/${prefix}",
  ById: "/${prefix}/:id",
} as const;

export class ${entity}ApiGateway implements I${entity}Port {
  // Implement port methods
  async getList(): Promise<unknown> {
    const response = await axiosInstance.get(${entity}ApiRoutes.List);
    return response.data;
  }
}

export const ${entityVar}ApiGateway = new ${entity}ApiGateway();
`
  );

  // _usecases
  w(
    `_usecases/${prefix}.port.ts`,
    `/**
 * 🟢 USE CASE LAYER - Port (Interface)
 */

// import type { ... } from "../_api/${prefix}.type";

export interface I${entity}Port {
  getList(): Promise<unknown>;
}
`
  );

  w(
    `_usecases/${prefix}.usecases.ts`,
    `/**
 * 🟢 USE CASE LAYER - Orchestration
 */

import type { I${entity}Port } from "./${prefix}.port";
import type { ${entity}Filters, ${entity}List } from "${alias(null, moduleKey, "_domain", `${prefix}.model`)}";

export class ${entity}UseCases {
  constructor(private readonly api: I${entity}Port) {}

  async getList(filters: ${entity}Filters): Promise<${entity}List> {
    const response = await this.api.getList();
    return { data: (response as { data?: unknown[] }).data ?? [], meta: { total: 0, page: 1, pageSize: 20 } };
  }
}
`
  );

  w(
    `_usecases/${prefix}.validations.ts`,
    `import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, MIN_SEARCH_LENGTH } from "../_domain/${prefix}.rules";

export const ${prefix}FiltersSchema = z.object({
  search: z.string().min(MIN_SEARCH_LENGTH).optional().or(z.literal("")),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type ${entity}FiltersSchema = z.infer<typeof ${prefix}FiltersSchema>;
`
  );

  w(
    `_usecases/${prefix}.mappers.ts`,
    `/**
 * Map API DTOs <-> Domain / Form
 */
`
  );

  // _routes
  const routePath = `/${prefix}`;
  w(
    `_routes/path.ts`,
    `class ${toPascal(prefix)}Urls {
  static readonly ROOT = "${routePath}";
  static readonly MANAGEMENT = \`\${${toPascal(prefix)}Urls.ROOT}/management\`;
}

export default ${toPascal(prefix)}Urls;
`
  );

  w(
    `_routes/index.tsx`,
    `import ${toPascal(prefix)}Urls from "./path";
import ${entity}ManagementPage from "../pages/${entity}ManagementPage";
import type { RouteWithMeta } from "@shared/types/route.type";
import Folder from "@mui/icons-material/Folder";

export const ${prefix}Route: RouteWithMeta = {
  path: ${toPascal(prefix)}Urls.ROOT,
  element: <${entity}ManagementPage />,
  meta: {
    label: "${entity}s",
    icon: <Folder />,
    showInMenu: true,
    order: 10,
  },
};
`
  );

  // hooks
  w(
    `hooks/${prefix}.use-cases.ts`,
    `/**
 * 🟡 ADAPTER - Composition root
 */

import { ${entity}UseCases } from "${alias(null, moduleKey, "_usecases", `${prefix}.usecases`)}";
import { ${entityVar}ApiGateway } from "${alias(null, moduleKey, "_api", `${prefix}.api`)}";

export const ${entityVar}UseCases = new ${entity}UseCases(${entityVar}ApiGateway);
`
  );

  w(
    `hooks/use${entity}List.ts`,
    `import { useQuery } from "@tanstack/react-query";
import type { ${entity}Filters } from "../_domain/${prefix}.model";
import { ${entityVar}UseCases } from "./${prefix}.use-cases";

export const ${entity}Keys = {
  all: ["${prefix}"] as const,
  lists: () => [...${entity}Keys.all, "list"] as const,
  list: (filters: ${entity}Filters) => [...${entity}Keys.lists(), filters] as const,
};

export function use${entity}List(filters: ${entity}Filters) {
  return useQuery({
    queryKey: ${entity}Keys.list(filters),
    queryFn: () => ${entityVar}UseCases.getList(filters),
    staleTime: 30_000,
  });
}
`
  );

  // pages
  w(
    `pages/${entity}ManagementPage.tsx`,
    `/**
 * 🟡 ADAPTER LAYER - Page Container
 */

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../_domain/${prefix}.rules";
import type { ${entity}Filters } from "../_domain/${prefix}.model";
import { use${entity}List } from "../hooks/use${entity}List";

export default function ${entity}ManagementPage() {
  const [filters, setFilters] = useState<${entity}Filters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = use${entity}List(filters);

  return (
    <Container>
      <Box py={2}>
        <Typography variant="h5">${entity} Management</Typography>
        {isLoading ? <Typography>Loading...</Typography> : <pre>{JSON.stringify(data, null, 2)}</pre>}
      </Box>
    </Container>
  );
}
`
  );

  // components (minimal)
  w(
    `components/${entity}Table.tsx`,
    `import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { ${entity}List } from "../_domain/${prefix}.model";

type Props = { data?: ${entity}List };

export default function ${entity}Table({ data }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
`
  );

  w(
    `components/${entity}Filters.tsx`,
    `import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import type { ${entity}Filters as Filters } from "../_domain/${prefix}.model";

type Props = { filters: Filters; onChange: (next: Partial<Filters>) => void };

export default function ${entity}Filters({ filters, onChange }: Props) {
  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        size="small"
        label="Search"
        value={filters.search ?? ""}
        onChange={(e) => onChange({ search: e.target.value })}
      />
    </Box>
  );
}
`
  );

  // modals
  w(
    `modals/${prefix}.modal.registry.tsx`,
    `import Create${entity}Modal from "./Create${entity}Modal";

export const ${entity}ModalKeys = {
  Create${entity}Modal: "Create${entity}Modal",
} as const;

const ${prefix}ModalRegistry = {
  [${entity}ModalKeys.Create${entity}Modal]: Create${entity}Modal,
};

export default ${prefix}ModalRegistry;
`
  );

  w(
    `modals/Create${entity}Modal.tsx`,
    `/**
 * 🟡 ADAPTER LAYER - Modal
 */

import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ${entity}ModalKeys } from "./${prefix}.modal.registry";

export type Create${entity}ModalProps = { onSuccess?: () => void };

const Create${entity}Modal = ({ type, payload }: ModalStack<Create${entity}ModalProps>) => {
  const { close } = useModalController();
  const { onSuccess } = payload ?? {};

  const handleClose = () => {
    onSuccess?.();
    close();
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Create ${entity}</DialogTitle>
      <DialogContent>TODO: form</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create${entity}Modal;
`
  );

  // i18n
  w(
    `i18n/en.json`,
    `{
  "createSuccess": "${entity} created successfully",
  "updateSuccess": "${entity} updated successfully",
  "deleteSuccess": "${entity} deleted successfully",
  "errors": {
    "forbidden": "You do not have permission to perform this action",
    "notFound": "${entity} not found"
  }
}
`
  );

  w(
    `i18n/vi.json`,
    `{
  "createSuccess": "Tạo ${entity} thành công",
  "updateSuccess": "Cập nhật ${entity} thành công",
  "deleteSuccess": "Xóa ${entity} thành công",
  "errors": {
    "forbidden": "Bạn không có quyền thực hiện thao tác này",
    "notFound": "Không tìm thấy ${entity}"
  }
}
`
  );

  console.log(
    `\n✅ Single module "${moduleKey}" created. Register the route in routes/privateRoute.tsx:\n   import { ${prefix}Route } from "@modules/${moduleKey}/_routes";\n   // add ${prefix}Route to privateRouteChildren\n`
  );
}

// --- Case 2: Nested module generators ---

function generateNestedModule(parentKey: string, childKey: string): void {
  const entity = toEntityName(childKey);
  const entityVar = toCamel(entity);
  const childPrefix = filePrefix(childKey);
  const parentPath = path.join(MODULES_ROOT, parentKey);
  const childRoot = path.join(parentPath, childKey);
  const parentAlias = `@modules/${parentKey}`;

  const w = (filePath: string, content: string) => {
    const full = path.join(childRoot, filePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trimEnd() + "\n", "utf-8");
    console.log("  +", `${childKey}/${filePath}`);
  };

  console.log(
    `\n📁 Nested module: ${parentKey}/${childKey} (entity: ${entity})\n`
  );

  // Ensure parent _routes/paths.ts exists (or path.ts for single-segment parent)
  const pathsPath = path.join(parentPath, "_routes", "paths.ts");
  const pathTsAlt = path.join(parentPath, "_routes", "path.ts");
  const pathTsExists = fs.existsSync(pathsPath);
  const pathTsAltExists = fs.existsSync(pathTsAlt);
  const parentRoutePath = `/${parentKey.replace(/_/g, "-")}`;
  const childPathConst = childKey.toUpperCase().replace(/-/g, "_");
  let parentClass =
    parentKey
      .split("_")
      .map(s => toPascal(s))
      .join("") + "Urls";

  if (pathTsExists) {
    const content = fs.readFileSync(pathsPath, "utf-8");
    const match = content.match(/class\s+(\w+)\s*\{/);
    if (match) parentClass = match[1];
    if (!content.includes(childPathConst)) {
      const newLine = `  static readonly ${childPathConst} = \`\${${parentClass}.ROOT}/${childKey}\`;\n`;
      const inserted = content.replace(
        /(static readonly ROOT[^;]+;\n)/,
        `$1${newLine}`
      );
      fs.writeFileSync(pathsPath, inserted, "utf-8");
      console.log("  ~ _routes/paths.ts (parent, added path)");
    }
  } else if (!pathTsAltExists) {
    fs.mkdirSync(path.join(parentPath, "_routes"), { recursive: true });
    fs.writeFileSync(
      pathsPath,
      `class ${parentClass} {
  static readonly ROOT = "${parentRoutePath}";
  static readonly ${childPathConst} = \`\${${parentClass}.ROOT}/${childKey}\`;
}

export default ${parentClass};
`,
      "utf-8"
    );
    console.log("  + _routes/paths.ts (parent)");
  } else if (pathTsAltExists) {
    const altContent = fs.readFileSync(pathTsAlt, "utf-8");
    const match = altContent.match(/class\s+(\w+)\s*\{/);
    if (match) parentClass = match[1];
  }

  // Parent _domain/<child> and _usecases/<child> and _api/<child> (minimal for nested)
  const domainChildPath = path.join(parentPath, "_domain", childKey);
  if (!fs.existsSync(domainChildPath)) {
    fs.mkdirSync(domainChildPath, { recursive: true });
    fs.writeFileSync(
      path.join(domainChildPath, `${childPrefix}.model.ts`),
      `/**
 * 🔵 DOMAIN LAYER - ${entity} models
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

export interface ${entity}Item {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ${entity}List = PaginatedResponse<${entity}Item>;

export interface ${entity}Filters {
  page?: number;
  pageSize?: number;
  search?: string;
}
`,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(domainChildPath, `${childPrefix}.rules.ts`),
      `export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
`,
      "utf-8"
    );
    console.log("  + _domain/" + childKey + "/ (parent layer)");
  }

  const apiChildPath = path.join(parentPath, "_api", childKey);
  if (!fs.existsSync(path.join(apiChildPath, `${childPrefix}.api.ts`))) {
    fs.mkdirSync(apiChildPath, { recursive: true });
    fs.writeFileSync(
      path.join(apiChildPath, `${childPrefix}.type.ts`),
      `// Define DTOs for ${entity} API
`,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(apiChildPath, `${childPrefix}.api.ts`),
      `import axiosInstance from "@core/axios";
import type { I${entity}Port } from "${parentAlias}/_usecases/${childKey}/${childPrefix}.port";

export const ${entity}ApiRoutes = {
  List: "/${childKey}",
  ById: "/${childKey}/:id",
} as const;

export class ${entity}ApiGateway implements I${entity}Port {
  async getList(): Promise<unknown> {
    const response = await axiosInstance.get(${entity}ApiRoutes.List);
    return response.data;
  }
}

export const ${entityVar}ApiGateway = new ${entity}ApiGateway();
`,
      "utf-8"
    );
    console.log("  + _api/" + childKey + "/ (parent layer)");
  }

  const usecasesChildPath = path.join(parentPath, "_usecases", childKey);
  if (!fs.existsSync(path.join(usecasesChildPath, `${childPrefix}.port.ts`))) {
    fs.mkdirSync(usecasesChildPath, { recursive: true });
    fs.writeFileSync(
      path.join(usecasesChildPath, `${childPrefix}.port.ts`),
      `/**
 * 🟢 USE CASE LAYER - Port for ${entity}
 */

export interface I${entity}Port {
  getList(): Promise<unknown>;
}
`,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(usecasesChildPath, `${childPrefix}.usecases.ts`),
      `/**
 * 🟢 USE CASE LAYER - ${entity} use cases
 */

import type { I${entity}Port } from "./${childPrefix}.port";
import type { ${entity}Filters, ${entity}List } from "${parentAlias}/_domain/${childKey}/${childPrefix}.model";

export class ${entity}UseCases {
  private readonly api: I${entity}Port;

  constructor(api: I${entity}Port) {
    this.api = api;
  }

  async getList(filters: ${entity}Filters): Promise<${entity}List> {
    const response = await this.api.getList();
    return { data: (response as { data?: unknown[] })?.data ?? [], meta: { total: 0, page: 1, pageSize: 20 } };
  }
}
`,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(usecasesChildPath, `${childPrefix}.validations.ts`),
      `import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "${parentAlias}/_domain/${childKey}/${childPrefix}.rules";

export const ${childPrefix}FiltersSchema = z.object({
  search: z.string().optional().or(z.literal("")),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.number().int().default(DEFAULT_PAGE_SIZE),
});

export type ${entity}FiltersSchema = z.infer<typeof ${childPrefix}FiltersSchema>;
`,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(usecasesChildPath, `${childPrefix}.mappers.ts`),
      `/** Map API <-> Domain for ${entity} */\n`,
      "utf-8"
    );
    console.log("  + _usecases/" + childKey + "/ (parent layer)");
  }

  // Child module: _routes, pages, components, hooks, modals
  const pathsImport = pathTsAltExists ? "path" : "paths";
  w(
    `_routes/index.tsx`,
    `import ${parentClass} from "../../_routes/${pathsImport}";
import ${entity}ManagementPage from "../pages/${entity}ManagementPage";

const ${childPrefix}Route = {
  path: ${parentClass}.${childPathConst},
  element: <${entity}ManagementPage />,
  meta: {
    label: "${entity}",
    showInMenu: true,
    order: 1,
  },
};

export default ${childPrefix}Route;
`
  );

  w(
    `hooks/${childPrefix}.use-cases.ts`,
    `import { ${entity}UseCases } from "${parentAlias}/_usecases/${childKey}/${childPrefix}.usecases";
import { ${entityVar}ApiGateway } from "${parentAlias}/_api/${childKey}/${childPrefix}.api";

export const ${entityVar}UseCases = new ${entity}UseCases(${entityVar}ApiGateway);
`
  );

  w(
    `hooks/use${entity}List.ts`,
    `import { useQuery } from "@tanstack/react-query";
import type { ${entity}Filters } from "${parentAlias}/_domain/${childKey}/${childPrefix}.model";
import { ${entityVar}UseCases } from "./${childPrefix}.use-cases";

export const ${entity}Keys = {
  all: ["${childKey}"] as const,
  lists: () => [...${entity}Keys.all, "list"] as const,
  list: (filters: ${entity}Filters) => [...${entity}Keys.lists(), filters] as const,
};

export function use${entity}List(filters: ${entity}Filters) {
  return useQuery({
    queryKey: ${entity}Keys.list(filters),
    queryFn: () => ${entityVar}UseCases.getList(filters),
    staleTime: 30_000,
  });
}
`
  );

  w(
    `pages/${entity}ManagementPage.tsx`,
    `/**
 * 🟡 ADAPTER LAYER - ${entity} page
 */

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useState } from "react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "${parentAlias}/_domain/${childKey}/${childPrefix}.rules";
import type { ${entity}Filters } from "${parentAlias}/_domain/${childKey}/${childPrefix}.model";
import { use${entity}List } from "../hooks/use${entity}List";

export default function ${entity}ManagementPage() {
  const [filters, setFilters] = useState<${entity}Filters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = use${entity}List(filters);

  return (
    <Container>
      <Box py={2}>
        <Typography variant="h5">${entity} Management</Typography>
        {isLoading ? <Typography>Loading...</Typography> : <pre>{JSON.stringify(data, null, 2)}</pre>}
      </Box>
    </Container>
  );
}
`
  );

  w(
    `components/${entity}Table.tsx`,
    `import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import type { ${entity}List } from "${parentAlias}/_domain/${childKey}/${childPrefix}.model";

type Props = { data?: ${entity}List };

export default function ${entity}Table({ data }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
`
  );

  w(
    `modals/${childPrefix}.modal.registry.tsx`,
    `import Create${entity}Modal from "./Create${entity}Modal";

export const ${entity}ModalKeys = {
  Create${entity}Modal: "Create${entity}Modal",
} as const;

const registry = {
  [${entity}ModalKeys.Create${entity}Modal]: Create${entity}Modal,
};

export default registry;
`
  );

  w(
    `modals/Create${entity}Modal.tsx`,
    `import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ${entity}ModalKeys } from "./${childPrefix}.modal.registry";

export type Create${entity}ModalProps = { onSuccess?: () => void };

const Create${entity}Modal = ({ payload }: ModalStack<Create${entity}ModalProps>) => {
  const { close } = useModalController();
  const { onSuccess } = payload ?? {};

  const handleClose = () => {
    onSuccess?.();
    close();
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Create ${entity}</DialogTitle>
      <DialogContent>TODO</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create${entity}Modal;
`
  );

  console.log(`\n✅ Nested module "${parentKey}/${childKey}" created.`);
  console.log(
    `   Add the child route to parent "${parentKey}" _routes/index.tsx:\n   import ${childPrefix}Route from "../${childKey}/_routes";\n   // in children: [ ..., ${childPrefix}Route ]\n`
  );
}

// --- CLI ---

function main() {
  const args = process.argv.slice(2).filter(Boolean);
  if (args.length === 0) {
    console.log(`
Usage:
  Case 1 - Single module:
    pnpm run gen:module <module_name>
    Example: pnpm run gen:module products

  Case 2 - Nested module (sub-module under parent):
    pnpm run gen:module <parent_module> <child_module>
    Example: pnpm run gen:module roles_permissions permissions

Conventions:
  - module_name: lowercase, use underscore for multi-word (e.g. roles_permissions).
  - Entity name is derived (e.g. products -> Product, roles -> Role).
`);
    process.exit(1);
  }

  if (args.length === 1) {
    generateSingleModule(args[0]);
  } else {
    generateNestedModule(args[0], args[1]);
  }
}

main();
