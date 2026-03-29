/**
 * 🟡 ADAPTER LAYER - Page Container
 * Main page for users management with filters and list
 */

import { Box, Container, Typography, Alert, Button } from "@mui/material";
import { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@shared/constants/paginations";
import { useUsersList } from "../hooks/useUsersList";
import UsersTable from "../components/UsersTable";
import type { UsersFilters } from "../_domain/users.model";
import UsersFiltersComponent from "../components/UsersFilters";
import ModalEngine from "@core/modal/ModalEngine";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import usersModalRegistry, { UsersModalKeys } from "../modals/users.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";

// Application-level sort defaults — không phải domain rules
const DEFAULT_SORT_BY = "createdAt" as const;
const DEFAULT_SORT_ORDER = "desc" as const;

const UsersManagementPage = () => {
  useRegisterModals(usersModalRegistry);
  const { open } = useModalController();

  const [filters, setFilters] = useState<UsersFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
    role: "all",
    isActive: "all",
    search: "",
  });

  const { data, isLoading, isError, error } = useUsersList(filters);

  const handleFiltersChange = (next: Partial<UsersFilters>) => {
    setFilters(prev => ({ ...prev, ...next, page: DEFAULT_PAGE }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
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
            onClick={() => open(UsersModalKeys.CreateUserModal)}
          >
            Tạo người dùng
          </Button>
        </Box>

        <UsersFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Không thể tải danh sách người dùng.{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại."}
          </Alert>
        )}

        {data && (
          <UsersTable
            users={data.data}
            meta={data.meta}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        )}

        {isLoading && !data && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">Đang tải...</Typography>
          </Box>
        )}
      </Box>

      <ModalEngine />
    </Container>
  );
};

export default UsersManagementPage;
