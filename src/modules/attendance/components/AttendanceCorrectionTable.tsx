/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for attendance correction requests with approve/reject actions.
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
import { canApproveCorrection } from "@modules/attendance/_domain/attendance.rules";
import type { PaginationMeta } from "@shared/types/pagination.type";
import type {
  AttendanceCorrection,
  AttendanceCorrectionFilters,
  CorrectionStatus,
} from "@modules/attendance/_domain/attendance.model";
import { AttendanceModalKeys } from "../modals/attendance.modal.registry";

const CORRECTION_STATUS_LABELS: Record<CorrectionStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const CORRECTION_STATUS_COLORS: Record<CorrectionStatus, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  rows: AttendanceCorrection[];
  meta: PaginationMeta;
  filters: AttendanceCorrectionFilters;
  onFiltersChange: (next: Partial<AttendanceCorrectionFilters>) => void;
  isLoading?: boolean;
}

export default function AttendanceCorrectionTable({
  rows,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: Props) {
  const { open } = useModalController();
  const permissions = useAuthStore((s) => s.permissions);
  const canApprove = canApproveCorrection(permissions);

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
        <Typography color="text.secondary">Chưa có yêu cầu điều chỉnh nào</Typography>
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
              <TableCell>Ngày</TableCell>
              <TableCell align="center">Xin vào lúc</TableCell>
              <TableCell align="center">Xin ra lúc</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú duyệt</TableCell>
              {canApprove && <TableCell align="right">Hành động</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.employeeName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{row.date}</Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" fontFamily="monospace">
                    {formatDateTime(row.requestedCheckInAt)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" fontFamily="monospace">
                    {row.requestedCheckOutAt ? formatDateTime(row.requestedCheckOutAt) : "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Tooltip title={row.reason} placement="top">
                    <Typography
                      variant="body2"
                      sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {row.reason}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Chip
                    label={CORRECTION_STATUS_LABELS[row.status]}
                    color={CORRECTION_STATUS_COLORS[row.status]}
                    size="small"
                    variant={row.status === "pending" ? "filled" : "outlined"}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.reviewNote ?? "—"}
                  </Typography>
                </TableCell>

                {canApprove && (
                  <TableCell align="right">
                    {row.status === "pending" && (
                      <Box display="flex" gap={0.5} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() =>
                            open(AttendanceModalKeys.ApproveCorrectionModal, {
                              correctionId: row.id,
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
                            open(AttendanceModalKeys.RejectCorrectionModal, {
                              correctionId: row.id,
                              employeeName: row.employeeName,
                            })
                          }
                        >
                          Từ chối
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={meta.totalItems}
        page={(filters.page ?? 1) - 1}
        onPageChange={(_, newPage) => onFiltersChange({ page: newPage + 1 })}
        rowsPerPage={filters.pageSize ?? 20}
        onRowsPerPageChange={(e) =>
          onFiltersChange({ pageSize: parseInt(e.target.value, 10), page: 1 })
        }
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Số hàng:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
      />
    </Paper>
  );
}
