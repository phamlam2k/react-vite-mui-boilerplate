/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for leave requests with approve/reject/cancel actions.
 * Status labels, colors are UI concerns — defined locally.
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
import { useModalController } from "@core/modal/hooks/useModalController";
import { useAuthStore } from "@shared/stores/auth.store";
import type { PaginationMeta } from "@shared/types/pagination.type";
import type {
  LeaveRequest,
  ILeaveRequestFilters,
  LeaveStatus,
} from "@modules/leave/_domain/leave.model";
import {
  canApproveLeave,
  canCancelLeaveRequest,
  isAwaitingApproval,
} from "@modules/leave/_domain/leave.rules";
import { LeaveModalKeys } from "../modals/leave.modal.registry";

const STATUS_LABELS: Record<LeaveStatus, string> = {
  draft: "Nháp",
  submitted: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<
  LeaveStatus,
  "default" | "warning" | "success" | "error" | "info"
> = {
  draft: "default",
  submitted: "warning",
  approved: "success",
  rejected: "error",
  cancelled: "info",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

interface Props {
  rows: LeaveRequest[];
  meta: PaginationMeta;
  filters: ILeaveRequestFilters;
  onFiltersChange: (next: Partial<ILeaveRequestFilters>) => void;
  isLoading?: boolean;
}

export default function LeaveRequestTable({
  rows,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: Props) {
  const { open } = useModalController();
  const { permissions, userId } = useAuthStore();

  const canApprove = canApproveLeave(permissions);
  const currentEmployeeId = userId ?? "";

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Chưa có yêu cầu nghỉ phép nào
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Loại nghỉ</TableCell>
              <TableCell>Từ ngày</TableCell>
              <TableCell>Đến ngày</TableCell>
              <TableCell align="center">Số ngày</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              const isOwner = row.employeeId === currentEmployeeId;
              const canCancel = canCancelLeaveRequest(row.status, isOwner);
              const canDecide = canApprove && isAwaitingApproval(row.status);

              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.employeeName}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{row.policyName}</Typography>
                    {row.halfDay && (
                      <Typography variant="caption" color="text.secondary">
                        (Nửa ngày
                        {row.halfDayType
                          ? ` — ${row.halfDayType === "morning" ? "sáng" : "chiều"}`
                          : ""}
                        )
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>{formatDate(row.startDate)}</TableCell>
                  <TableCell>{formatDate(row.endDate)}</TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {row.totalDays}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={row.reason ?? ""} placement="top">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.reason ?? "—"}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[row.status]}
                      color={STATUS_COLORS[row.status]}
                      size="small"
                      variant={
                        row.status === "submitted" ? "filled" : "outlined"
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box display="flex" gap={0.5} justifyContent="flex-end">
                      {canDecide && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              open(LeaveModalKeys.ApproveLeaveModal, {
                                requestId: row.id,
                                employeeName: row.employeeName,
                              })
                            }
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              open(LeaveModalKeys.RejectLeaveModal, {
                                requestId: row.id,
                                employeeName: row.employeeName,
                              })
                            }
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                      {canCancel && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            open(LeaveModalKeys.CancelLeaveModal, {
                              requestId: row.id,
                            })
                          }
                        >
                          Hủy
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={meta.totalItems}
        page={(filters.page ?? 1) - 1}
        onPageChange={(_, newPage) => onFiltersChange({ page: newPage + 1 })}
        rowsPerPage={filters.pageSize ?? 20}
        onRowsPerPageChange={e =>
          onFiltersChange({ pageSize: parseInt(e.target.value, 10), page: 1 })
        }
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Số hàng:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
      />
    </Paper>
  );
}
