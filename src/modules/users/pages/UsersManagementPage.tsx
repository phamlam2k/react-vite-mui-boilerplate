/**
 * 🟡 ADAPTER LAYER - Page Container
 * Main page for users management with filters and list
 */

import { Box, Container, Typography, Alert, Button } from "@mui/material";
import { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from "../_domain/users.rules";
import { useUsersList } from "../hooks/useUsersList";
import UsersTable from "../components/UsersTable";
import type { UsersFilters } from "../_domain/users.model";
import UsersFiltersComponent from "../components/UsersFilters";
import ModalEngine from "@core/modal/ModalEngine";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import usersModalRegistry, {
  UsersModalKeys,
} from "../modals/users.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";

const UsersManagementPage = () => {
  // Register modals
  useRegisterModals(usersModalRegistry);

  const { open } = useModalController();

  // State for filters
  const [filters, setFilters] = useState<UsersFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY as "createdAt",
    sortOrder: DEFAULT_SORT_ORDER as "desc",
    role: "all",
    isActive: "all",
    search: "",
  });

  // Fetch users with filters
  const { data, isLoading, isError, error } = useUsersList(filters);

  const handleOpenCreateModal = () => {
    open(UsersModalKeys.CreateUserModal);
  };

  const handleFiltersChange = (next: Partial<UsersFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...next,
      page: DEFAULT_PAGE, // business rule: reset page
    }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Quản lý người dùng
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Danh sách người dùng trong hệ thống
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Tạo người dùng
          </Button>
        </Box>

        {/* Filters */}
        <UsersFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Error State */}
        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Không thể tải danh sách người dùng.{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại."}
          </Alert>
        )}

        {/* Table */}
        {data && (
          <UsersTable
            users={data?.data || []}
            meta={data.meta}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        )}

        {/* Loading State (initial load only) */}
        {isLoading && !data && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">Đang tải...</Typography>
          </Box>
        )}
      </Box>

      {/* Modal Engine */}
      <ModalEngine />
    </Container>
  );
};

export default UsersManagementPage;
