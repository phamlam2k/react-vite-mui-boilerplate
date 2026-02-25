/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for roles list
 */

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type {
  RoleItem,
  RolesFilters,
} from "@modules/roles_permissions/_domain/roles/roles.model";
import { canDeleteRole } from "@modules/roles_permissions/_domain/roles/roles.rules";
import type { PaginationMeta } from "@shared/types/pagination.type";
import { useModalController } from "@core/modal/hooks/useModalController";
import { RolesModalKeys } from "../modals/roles.modal.registry";
import { useDeleteRoleMutation } from "../hooks/useDeleteRoleMutation";

interface RolesTableProps {
  roles: RoleItem[];
  meta: PaginationMeta;
  filters: RolesFilters;
  onFiltersChange: (filters: RolesFilters) => void;
  isLoading?: boolean;
}

export default function RolesTable({
  roles,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: RolesTableProps) {
  const { open } = useModalController();
  const deleteMutation = useDeleteRoleMutation();

  const handleOpenUpdateModal = (roleId: string) => {
    open(RolesModalKeys.UpdateRoleModal, { roleId });
  };

  const handleOpenPermissionsModal = (roleId: string) => {
    open(RolesModalKeys.RolePermissionsModal, { roleId });
  };

  const handleDelete = (role: RoleItem) => {
    if (!canDeleteRole(role)) return;
    if (
      window.confirm(
        `Bạn có chắc muốn xóa vai trò "${role.name}"? Vai trò hệ thống không thể xóa.`
      )
    ) {
      deleteMutation.mutate(role.id);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    onFiltersChange({ ...filters, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      pageSize: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">Đang tải...</Typography>
      </Box>
    );
  }

  if (roles.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không tìm thấy vai trò nào
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên vai trò</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Số quyền</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {role.name}
                  </Typography>
                </TableCell>
                <TableCell>{role.description ?? "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={role.isSystem ? "Hệ thống" : "Tùy chỉnh"}
                    size="small"
                    color={role.isSystem ? "default" : "primary"}
                    variant={role.isSystem ? "outlined" : "filled"}
                  />
                </TableCell>
                <TableCell>{role.permissionCount}</TableCell>
                <TableCell>{formatDate(role.updatedAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenPermissionsModal(role.id)}
                    sx={{ mr: 1 }}
                  >
                    Quyền
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenUpdateModal(role.id)}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  {canDeleteRole(role) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(role)}
                      disabled={deleteMutation.isPending}
                    >
                      Xóa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={meta.totalItems}
        page={meta.page - 1}
        onPageChange={handlePageChange}
        rowsPerPage={meta.pageSize}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} của ${count}`
        }
      />
    </Paper>
  );
}
