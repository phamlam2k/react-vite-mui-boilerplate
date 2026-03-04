import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import { resolve } from "node:path";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      boundaries,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      "boundaries/root-path": resolve(import.meta.dirname),
      "boundaries/include": ["src/**"],
      "boundaries/dependency-nodes": ["import", "dynamic-import"],

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.app.json",
        },
      },

      /**
       * Element types mapped to Clean Architecture layers.
       *
       * 🔵 Domain            _domain/
       * 🟢 Use Cases         _usecases/
       * 📋 Shared Contract   _api/*.type.ts   (type-only — any layer)
       * 🟡 Gateway           _api/*.api.ts
       * 🟡 Module Routes     _routes/          (inside modules)
       * 🟡 Module Adapter    hooks/ pages/ components/ modals/
       * 🔴 Core              @core/
       * 🔴 Themes            @themes/
       * 🔴 Shared            shared/
       * 🟠 Routes            routes/           (top-level)
       * ⚪ App               App.tsx, main.tsx
       */
      "boundaries/elements": [
        {
          type: "shared-contract",
          pattern: "*.type.ts",
          mode: "file",
          basePattern: "src/modules/*/_api",
          baseCapture: ["module"],
        },
        {
          type: "gateway",
          pattern: "*.api.ts",
          mode: "file",
          basePattern: "src/modules/*/_api",
          baseCapture: ["module"],
        },
        {
          type: "domain",
          pattern: "_domain",
          mode: "folder",
          basePattern: "src/modules/*",
          baseCapture: ["module"],
        },
        {
          type: "usecases",
          pattern: "_usecases",
          mode: "folder",
          basePattern: "src/modules/*",
          baseCapture: ["module"],
        },
        {
          type: "module-routes",
          pattern: "_routes",
          mode: "folder",
          basePattern: "src/modules/*",
          baseCapture: ["module"],
        },
        {
          type: "module-adapter",
          pattern: ["hooks", "pages", "components", "modals"],
          mode: "folder",
          basePattern: "src/modules/*",
          baseCapture: ["module"],
        },
        {
          type: "core",
          pattern: "src/@core",
          mode: "folder",
        },
        {
          type: "themes",
          pattern: "src/@themes",
          mode: "folder",
        },
        {
          type: "shared",
          pattern: "shared",
          mode: "folder",
          basePattern: "src",
          baseCapture: ["shared"],
        },
        {
          type: "routes",
          pattern: "src/routes",
          mode: "folder",
        },
        {
          type: "app",
          pattern: ["App.tsx", "AppRouter.tsx", "main.tsx"],
          mode: "file",
          basePattern: "src",
        },
      ],
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ regex: "^@mui/[^/]+$" }],
        },
      ],

      // Use our own Clean Architecture rules; disable generic \"no-private\"
      // because we are not using element-level `private` on `shared`.
      ...boundaries.configs.recommended.rules,
      "boundaries/no-private": "off",

      /**
       * Clean Architecture dependency rules (Port pattern, as in roles_permissions).
       *
       * Golden Rule: dependencies point INWARD only.
       *   🔴 Infra → 🟡 Adapters → 🟢 Use Cases → 🔵 Domain
       *                                             ↗
       *                       📋 Shared Contract ──┘  (type-only, any layer)
       *
       * Port pattern:
       *   - Use cases depend only on Port (interface in _usecases/*.port.ts), NOT on Gateway.
       *   - Gateway implements Port → Gateway imports from Use cases (inward).
       *   - Adapter (hooks) injects Gateway when calling use case: useCase(api, ...).
       *
       * Cross-module: inner layers only within same module (${from.module}).
       */
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          message:
            "${file.type} is not allowed to import from ${dependency.type}. Check Clean Architecture dependency rules.",
          rules: [
            // ─── 🔵 Domain (innermost) ───
            {
              from: ["domain"],
              allow: [
                ["domain", { module: "${from.module}" }],
                ["shared-contract", { module: "${from.module}" }],
                "shared-contract",
                "shared",
              ],
            },
            // ─── 🟢 Use Cases — Port only, NO Gateway import ───
            {
              from: ["usecases"],
              allow: [
                ["domain", { module: "${from.module}" }],
                ["usecases", { module: "${from.module}" }],
                ["shared-contract", { module: "${from.module}" }],
                "shared-contract",
                "shared",
              ],
            },
            // ─── 📋 Shared Contract (type-only DTOs) ───
            {
              from: ["shared-contract"],
              allow: ["core", "shared"],
            },
            // ─── 🟡 Gateway — implements Port, depends on Use cases (inward) ───
            {
              from: ["gateway"],
              allow: [
                ["usecases", { module: "${from.module}" }],
                ["shared-contract", { module: "${from.module}" }],
                "core",
                "shared",
              ],
            },
            // ─── 🟡 Module Routes ───
            {
              from: ["module-routes"],
              allow: [
                ["domain", { module: "${from.module}" }],
                ["usecases", { module: "${from.module}" }],
                ["shared-contract", { module: "${from.module}" }],
                ["gateway", { module: "${from.module}" }],
                ["module-routes", { module: "${from.module}" }],
                ["module-adapter", { module: "${from.module}" }],
                "core",
                "themes",
                "shared",
              ],
            },
            // ─── 🟡 Module Adapter (hooks, pages, components, modals) ───
            {
              from: ["module-adapter"],
              allow: [
                ["domain", { module: "${from.module}" }],
                ["usecases", { module: "${from.module}" }],
                ["shared-contract", { module: "${from.module}" }],
                ["gateway", { module: "${from.module}" }],
                ["module-adapter", { module: "${from.module}" }],
                ["module-routes", { module: "${from.module}" }],
                "module-adapter",
                "shared-contract",
                "shared",
                "core",
              ],
            },
            // ─── 🔴 Infrastructure (core, themes, shared) ───
            {
              from: ["core"],
              allow: ["core", "themes", "shared", "shared-contract"],
            },
            {
              from: ["themes"],
              allow: ["core", "themes", "shared"],
            },
            {
              from: ["shared"],
              allow: ["core", "themes", "shared", "gateway"],
            },
            // ─── 🟠 Top-level Routes ───
            {
              from: ["routes"],
              allow: ["module-routes", "core", "shared", "shared-contract"],
            },
            // ─── ⚪ App entry ───
            {
              from: ["app"],
              allow: ["app", "core", "themes", "routes", "shared"],
            },
          ],
        },
      ],
    },
  },
]);
