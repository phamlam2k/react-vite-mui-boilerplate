/**
 * 🟡 ADAPTER LAYER - Page Container
 * Roles management page with filters and list
 */

import { Box, Container, Typography, Alert, Button } from "@mui/material";
import { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@modules/roles_permissions/_domain/roles/roles.rules";
import type { RolesFilters } from "@modules/roles_permissions/_domain/roles/roles.model";
import { useRolesList } from "../hooks/useRolesList";
import RolesTable from "../components/RolesTable";
import RolesFiltersComponent from "../components/RolesFilters";
import ModalEngine from "@core/modal/ModalEngine";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import rolesModalRegistry, {
  RolesModalKeys,
} from "../modals/roles.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";

export default function RolesManagementPage() {
  useRegisterModals(rolesModalRegistry);
  const { open } = useModalController();

  const [filters, setFilters] = useState<RolesFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
  });

  const { data, isLoading, isError, error } = useRolesList(filters);

  const handleOpenCreateModal = () => {
    open(RolesModalKeys.CreateRoleModal);
  };

  const handleFiltersChange = (next: Partial<RolesFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...next,
      page: DEFAULT_PAGE,
    }));
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
              Vai trò
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Danh sách vai trò và quản lý quyền
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Thêm vai trò
          </Button>
        </Box>

        <RolesFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Không thể tải danh sách vai trò.{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại."}
          </Alert>
        )}

        {data && (
          <RolesTable
            roles={data.data}
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
}
