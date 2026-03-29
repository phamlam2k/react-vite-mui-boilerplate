/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for employees list
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
  Employee,
  EmployeesFilters,
} from "../_domain/employees.model";
import type { PaginationMeta } from "@shared/types/pagination.type";
import { useModalController } from "@core/modal/hooks/useModalController";
import { EmployeesModalKeys } from "../modals/employees.modal.registry";
import { useDeleteEmployeeMutation } from "../hooks/useDeleteEmployeeMutation";

// Display labels — UI concern, không thuộc Domain layer
const STATUS_LABELS: Record<Employee["status"], string> = {
  probation: "Thử việc",
  active: "Đang làm việc",
  on_leave: "Nghỉ phép",
  terminated: "Đã nghỉ",
};

const WORK_MODE_LABELS: Record<NonNullable<Employee["workMode"]>, string> = {
  office: "Văn phòng",
  remote: "Làm từ xa",
  hybrid: "Kết hợp",
};

const statusColorMap: Record<
  Employee["status"],
  "default" | "warning" | "success" | "error"
> = {
  probation: "warning",
  active: "success",
  on_leave: "default",
  terminated: "error",
};

interface EmployeesTableProps {
  employees: Employee[];
  meta: PaginationMeta;
  filters: EmployeesFilters;
  onFiltersChange: (filters: EmployeesFilters) => void;
  isLoading?: boolean;
}

export default function EmployeesTable({
  employees,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: EmployeesTableProps) {
  const { open } = useModalController();
  const deleteMutation = useDeleteEmployeeMutation();

  const handleOpenUpdateModal = (employeeId: string) => {
    open(EmployeesModalKeys.UpdateEmployeeModal, { employeeId });
  };

  const handleDelete = (employeeId: string) => {
    if (window.confirm("Bạn có chắc muốn chấm dứt hợp đồng nhân viên này?")) {
      deleteMutation.mutate(employeeId);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    onFiltersChange({
      ...filters,
      page: newPage + 1,
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

  if (employees.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không tìm thấy nhân viên nào
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
              <TableCell>Mã NV</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hình thức</TableCell>
              <TableCell>Ngày vào làm</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {emp.employeeCode}
                  </Typography>
                </TableCell>
                <TableCell>{emp.fullName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.orgUnitName}</TableCell>
                <TableCell>{emp.positionTitle}</TableCell>
                <TableCell>
                  <Chip
                    label={STATUS_LABELS[emp.status]}
                    size="small"
                    color={statusColorMap[emp.status]}
                  />
                </TableCell>
                <TableCell>{emp.workMode ? WORK_MODE_LABELS[emp.workMode] : "—"}</TableCell>
                <TableCell>{formatDate(emp.hireDate)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenUpdateModal(emp.id)}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  {emp.status !== "terminated" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(emp.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Chấm dứt
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
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} của ${count}`
        }
      />
    </Paper>
  );
}
