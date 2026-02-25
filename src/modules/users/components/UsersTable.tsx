/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for users list
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
  TableSortLabel,
  Typography,
} from "@mui/material";
import type { User, UsersFilters } from "../_domain/users.model";
import { STATUS_LABELS } from "../_domain/users.rules";
import type { PaginationMeta } from "@shared/types/pagination.type";
import { useModalController } from "@core/modal/hooks/useModalController";
import { UsersModalKeys } from "../modals/users.modal.registry";

interface UsersTableProps {
  users: User[];
  meta: PaginationMeta;
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
  isLoading?: boolean;
}

export default function UsersTable({
  users,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: UsersTableProps) {
  const { open } = useModalController();

  const handleOpenUpdateModal = (userId: string) => {
    open(UsersModalKeys.UpdateUserModal, { userId });
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    onFiltersChange({
      ...filters,
      page: newPage + 1, // MUI uses 0-indexed, API uses 1-indexed
    });
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

  const handleSort = (column: UsersFilters["sortBy"]) => {
    const isAsc = filters.sortBy === column && filters.sortOrder === "asc";
    onFiltersChange({
      ...filters,
      sortBy: column,
      sortOrder: isAsc ? "desc" : "asc",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">Đang tải...</Typography>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không tìm thấy người dùng nào
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
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === "username"}
                  direction={
                    filters.sortBy === "username" ? filters.sortOrder : "asc"
                  }
                  onClick={() => handleSort("username")}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === "email"}
                  direction={
                    filters.sortBy === "email" ? filters.sortOrder : "asc"
                  }
                  onClick={() => handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === "lastLoginAt"}
                  direction={
                    filters.sortBy === "lastLoginAt" ? filters.sortOrder : "asc"
                  }
                  onClick={() => handleSort("lastLoginAt")}
                >
                  Đăng nhập cuối
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === "createdAt"}
                  direction={
                    filters.sortBy === "createdAt" ? filters.sortOrder : "asc"
                  }
                  onClick={() => handleSort("createdAt")}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {user.username}
                  </Typography>
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.displayRole}
                    size="small"
                    color={user.role === "admin" ? "error" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      STATUS_LABELS[
                        user.isActive.toString() as "true" | "false"
                      ]
                    }
                    size="small"
                    color={user.isActive ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  {user.lastLoginAt
                    ? formatDate(user.lastLoginAt)
                    : "Chưa đăng nhập"}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenUpdateModal(user.id)}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={meta.totalItems}
        page={meta.page - 1} // MUI uses 0-indexed
        onPageChange={handlePageChange}
        rowsPerPage={meta.pageSize}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} của ${count}`
        }
      />
    </Paper>
  );
}
