/**
 * 🟡 ADAPTER LAYER - Page Container
 * Organizations management page — list, filter, create, update, delete
 */

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import ModalEngine from "@core/modal/ModalEngine";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { OrgsFilters } from "@modules/organizations/_domain/organizations.model";
import { canCreateOrg } from "@modules/organizations/_domain/organizations.rule";

import { useOrgsList } from "../hooks/useOrgsList";
import OrgsFiltersComponent from "../components/OrgsFilters";
import OrgsTable from "../components/OrgsTable";
import orgsModalRegistry, {
  OrgsModalKeys,
} from "../modals/orgs.modal.registry";
import { useAuthStore } from "@shared/stores/auth.store";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@shared/constants/paginations";

export default function OrgsManagementPage() {
  useRegisterModals(orgsModalRegistry);
  const { open } = useModalController();
  const permissions = useAuthStore.getState().permissions;

  const [filters, setFilters] = useState<OrgsFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
    type: "all",
    isActive: "all",
  });

  const { data, isLoading, isError, error } = useOrgsList(filters);

  const handleFiltersChange = (next: Partial<OrgsFilters>) => {
    setFilters(prev => ({ ...prev, ...next, page: next.page ?? DEFAULT_PAGE }));
  };

  const handleOpenCreateModal = () => {
    open(OrgsModalKeys.CreateOrgModal);
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
              Đơn vị tổ chức
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý cơ cấu tổ chức: công ty, phòng ban, nhóm
            </Typography>
          </Box>

          {canCreateOrg(permissions) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
            >
              Thêm đơn vị
            </Button>
          )}
        </Box>

        {/* Filters */}
        <OrgsFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Error */}
        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Không thể tải danh sách đơn vị.{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại."}
          </Alert>
        )}

        {/* Table */}
        {data && (
          <OrgsTable
            orgs={data.data}
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
