import z from "zod";

export type PasswordSchemaProps = {
  minLength: number;
  maxLength: number;
};

export const passwordSchema = ({ minLength, maxLength }: PasswordSchemaProps) =>
  z
    .string()
    .min(minLength, {
      message: `Mật khẩu tối thiểu ${minLength} ký tự`,
    })
    .max(maxLength, {
      message: `Mật khẩu tối đa ${maxLength} ký tự`,
    })
    .refine(password => /[A-Z]/.test(password), {
      message: "Mật khẩu phải có chữ hoa",
    })
    .refine(password => /[a-z]/.test(password), {
      message: "Mật khẩu phải có chữ thường",
    })
    .refine(password => /[0-9]/.test(password), {
      message: "Mật khẩu phải có số",
    })
    .refine(password => /[!@#$%^&*]/.test(password), {
      message: "Mật khẩu phải có ký tự đặc biệt",
    });

/**
 * Schema: password + confirmPassword (dùng cho Create user, Set new password)
 * Không có currentPassword.
 */
export const passwordWithConfirmSchema = ({
  minLength,
  maxLength,
}: PasswordSchemaProps) =>
  z
    .object({
      password: passwordSchema({ minLength, maxLength }),
      confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Mật khẩu và xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    });

/**
 * Schema: currentPassword + password + confirmPassword (dùng cho Đổi mật khẩu)
 */
export const updatePasswordSchema = ({
  minLength,
  maxLength,
}: PasswordSchemaProps) =>
  z
    .object({
      currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
      password: passwordSchema({ minLength, maxLength }),
      confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Mật khẩu và xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    });

/**
 * Schema: password + confirmPassword optional (dùng cho Update user - đổi mật khẩu tùy chọn)
 */
export const passwordWithConfirmOptionalSchema = ({
  minLength,
  maxLength,
}: PasswordSchemaProps) =>
  z
    .object({
      password: passwordSchema({ minLength, maxLength }).optional(),
      confirmPassword: z.string().optional(),
    })
    .refine(data => !data.password || data.password === data.confirmPassword, {
      message: "Mật khẩu và xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    });

export type PasswordSchema = z.infer<ReturnType<typeof passwordSchema>>;
export type PasswordWithConfirmSchema = z.infer<
  ReturnType<typeof passwordWithConfirmSchema>
>;
export type UpdatePasswordSchema = z.infer<
  ReturnType<typeof updatePasswordSchema>
>;
export type PasswordWithConfirmOptionalSchema = z.infer<
  ReturnType<typeof passwordWithConfirmOptionalSchema>
>;
