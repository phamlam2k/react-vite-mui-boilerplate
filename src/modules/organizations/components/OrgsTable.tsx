/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for org units list with pagination and actions
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { OrgUnitItem, OrgUnitType, OrgsFilters } from "@modules/organizations/_domain/organizations.model";
import { canDeleteOrg, canEditOrg } from "@modules/organizations/_domain/organizations.rule";

// Display labels belong in the UI/adapter layer, not in Domain
const ORG_TYPE_LABELS: Record<OrgUnitType, string> = {
  company: "Công ty",
  business_unit: "Đơn vị kinh doanh",
  department: "Phòng ban",
  team: "Nhóm",
};
import type { PaginationMeta } from "@shared/types/pagination.type";
import { useModalController } from "@core/modal/hooks/useModalController";
import { OrgsModalKeys } from "../modals/orgs.modal.registry";
import { useDeleteOrgMutation } from "../hooks/useDeleteOrgMutation";
import { useAuthStore } from "@shared/stores/auth.store";

interface OrgsTableProps {
  orgs: OrgUnitItem[];
  meta: PaginationMeta;
  filters: OrgsFilters;
  onFiltersChange: (next: Partial<OrgsFilters>) => void;
  isLoading?: boolean;
}

const TYPE_COLORS: Record<string, "default" | "primary" | "secondary" | "info" | "success"> = {
  company: "primary",
  business_unit: "secondary",
  department: "info",
  team: "success",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function OrgsTable({
  orgs,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: OrgsTableProps) {
  const { open } = useModalController();
  const permissions = useAuthStore.getState().permissions;
  const deleteMutation = useDeleteOrgMutation();

  const canEdit = canEditOrg(permissions);
  const canDelete = canDeleteOrg(permissions);

  const handleOpenUpdateModal = (orgId: string) => {
    open(OrgsModalKeys.UpdateOrgModal, { orgId });
  };

  const handleDelete = (org: OrgUnitItem) => {
    if (!canDelete) return;
    if (
      window.confirm(
        `Bạn có chắc muốn xóa đơn vị "${org.name}"?\nĐơn vị có thành viên không thể xóa.`
      )
    ) {
      deleteMutation.mutate(org.id);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    onFiltersChange({ page: newPage + 1 });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ pageSize: parseInt(e.target.value, 10), page: 1 });
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">Đang tải...</Typography>
      </Box>
    );
  }

  if (orgs.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không tìm thấy đơn vị tổ chức nào
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
              <TableCell>Tên đơn vị</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgs.map(org => (
              <TableRow key={org.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {org.name}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {org.code ?? "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={ORG_TYPE_LABELS[org.type] ?? org.type}
                    size="small"
                    color={TYPE_COLORS[org.type] ?? "default"}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={org.isActive ? "Hoạt động" : "Ngừng"}
                    size="small"
                    color={org.isActive ? "success" : "default"}
                    variant={org.isActive ? "filled" : "outlined"}
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title={org.description ?? ""} placement="top">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {org.description ?? "—"}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell>{formatDate(org.updatedAt)}</TableCell>

                <TableCell align="right">
                  {canEdit && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenUpdateModal(org.id)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(org)}
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
