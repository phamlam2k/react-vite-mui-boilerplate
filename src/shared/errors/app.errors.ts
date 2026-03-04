/**
 * 🔴 SHARED INFRASTRUCTURE - Custom Error Classes
 *
 * Typed errors for use in Use Case layer.
 * Adapter hooks can catch specific error types and handle them appropriately
 * (e.g. show a toast, redirect to login, display inline validation message).
 *
 * NOTE: Error messages are intentionally kept as neutral codes/keys.
 * Display text (i18n translations) is the responsibility of the adapter/hook layer.
 */

export type AppErrorCode = "FORBIDDEN" | "NOT_FOUND" | "VALIDATION" | "UNKNOWN";

/**
 * Base error class for all application errors.
 * Always prefer a specific subclass over throwing AppError directly.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(message: string, code: AppErrorCode = "UNKNOWN") {
    super(message);
    this.name = "AppError";
    this.code = code;
    // Maintain proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the current user lacks the required permission.
 * Adapter should show an error toast or redirect to 403.
 * @param messageKey - Optional scoped key passed by use case (e.g. "errors.forbiddenCreate")
 */
export class ForbiddenError extends AppError {
  readonly messageKey: string;

  constructor(messageKey = "errors.forbidden") {
    super(messageKey, "FORBIDDEN");
    this.name = "ForbiddenError";
    this.messageKey = messageKey;
  }
}

/**
 * Thrown when a requested resource does not exist or the ID is empty/null.
 * Adapter should show a not-found toast or navigate away.
 * @param messageKey - Optional scoped key passed by use case (e.g. "errors.notFound")
 */
export class NotFoundError extends AppError {
  readonly messageKey: string;

  constructor(messageKey = "errors.notFound") {
    super(messageKey, "NOT_FOUND");
    this.name = "NotFoundError";
    this.messageKey = messageKey;
  }
}

/**
 * Thrown when input data fails business-rule validation (not schema validation).
 * Adapter can display this as an inline form error or toast.
 */
export class ValidationError extends AppError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION");
    this.name = "ValidationError";
    this.field = field;
  }
}
