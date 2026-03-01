/**
 * 🟡 ADAPTER LAYER - Page Container
 * HRM Employees management page with filters and list
 */

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../_domain/employees.rules";
import { useEmployeesList } from "../hooks/useEmployeesList";
import EmployeesTable from "../components/EmployeesTable";
import type { EmployeesFilters } from "../_domain/employees.model";
import EmployeesFiltersComponent from "../components/EmployeesFilters";
import ModalEngine from "@core/modal/ModalEngine";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import employeesModalRegistry, {
  EmployeesModalKeys,
} from "../modals/employees.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";

export default function EmployeesManagementPage() {
  useRegisterModals(employeesModalRegistry);
  const { open } = useModalController();

  const [filters, setFilters] = useState<EmployeesFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    status: "all",
    workMode: "all",
    search: "",
  });

  const { data, isLoading, isError, error } = useEmployeesList(filters);

  const handleOpenCreateModal = () => {
    open(EmployeesModalKeys.CreateEmployeeModal);
  };

  const handleFiltersChange = (next: Partial<EmployeesFilters>) => {
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
              Quản lý nhân sự
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Danh sách nhân viên theo đơn vị và trạng thái
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Tuyển dụng nhân viên
          </Button>
        </Box>

        <EmployeesFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Không thể tải danh sách nhân viên.{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại."}
          </Alert>
        )}

        {data && (
          <EmployeesTable
            employees={data.data}
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
