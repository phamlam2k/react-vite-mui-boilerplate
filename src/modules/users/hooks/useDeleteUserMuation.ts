import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserUseCase } from "../_usecases/delete-user/delete-user.usecase";
import { UsersKeys } from "./useUsersList";
import { toast } from "react-toastify";

const useDeleteUserMuation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUserUseCase(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
      toast.success("Người dùng đã được xóa thành công");
    },
  });
};

export default useDeleteUserMuation;
