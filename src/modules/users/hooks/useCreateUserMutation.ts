/**
 * 🟡 ADAPTER LAYER - React Hook
 * Adapts Create User Use Case to TanStack Mutation (Framework-specific)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserSchema } from "../_usecases/create/create.validation";
import { createUserUseCase } from "../_usecases/create/create.usecase";
import { UsersKeys } from "./useUsersList";
import { toast } from "react-toastify";

/**
 * React Mutation Hook - Wraps pure use case with mutation logic
 *
 * Responsibilities:
 * - Mutation state management
 * - Cache invalidation
 * - Optimistic updates (optional)
 * - Error handling at UI level
 *
 * ✅ Framework-dependent (React, TanStack Query)
 * ✅ Thin wrapper around use case
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateUserSchema) => createUserUseCase(formData),
    onSuccess: () => {
      toast.success("Người dùng đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
    },
  });
}
