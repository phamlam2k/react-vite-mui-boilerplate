/**
 * 🔴 SHARED INFRASTRUCTURE - i18n Configuration
 *
 * Initializes i18next with react-i18next.
 * Namespaces are per-module; shared keys live in "common".
 * Default language: Vietnamese ("vi"), fallback: "vi".
 *
 * Import this file as a side-effect in main.tsx BEFORE rendering the app.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Shared
import viCommon from "./locales/vi/common.json";
import enCommon from "./locales/en/common.json";

// Users module
import viUsers from "@modules/users/i18n/vi.json";
import enUsers from "@modules/users/i18n/en.json";

// Employees module
import viEmployees from "@modules/employees/i18n/vi.json";
import enEmployees from "@modules/employees/i18n/en.json";

// Roles & Permissions module
import viRoles from "@modules/roles_permissions/i18n/vi.json";
import enRoles from "@modules/roles_permissions/i18n/en.json";

// Auth module
import viAuth from "@modules/auth/i18n/vi.json";
import enAuth from "@modules/auth/i18n/en.json";

void i18n.use(initReactI18next).init({
  lng: "vi",
  fallbackLng: "vi",
  defaultNS: "common",
  ns: ["common", "users", "employees", "roles", "auth"],
  resources: {
    vi: {
      common: viCommon,
      users: viUsers,
      employees: viEmployees,
      roles: viRoles,
      auth: viAuth,
    },
    en: {
      common: enCommon,
      users: enUsers,
      employees: enEmployees,
      roles: enRoles,
      auth: enAuth,
    },
  },
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
