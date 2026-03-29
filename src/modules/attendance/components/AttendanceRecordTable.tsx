/**
 * 🟡 ADAPTER LAYER - UI Component
 * Data table for attendance records.
 * Status labels and colors defined locally — UI concerns.
 */

import Box from "@mui/material/Box";
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
import type { PaginationMeta } from "@shared/types/pagination.type";
import type {
  AttendanceRecord,
  AttendanceRecordFilters,
  AttendanceStatus,
  AttendanceWorkMode,
} from "@modules/attendance/_domain/attendance.model";

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Có mặt",
  absent: "Vắng mặt",
  late: "Đi muộn",
  half_day: "Nửa ngày",
  corrected: "Đã điều chỉnh",
};

const STATUS_COLORS: Record<AttendanceStatus, "success" | "error" | "warning" | "info" | "default"> = {
  present: "success",
  absent: "error",
  late: "warning",
  half_day: "info",
  corrected: "default",
};

const WORK_MODE_LABELS: Record<AttendanceWorkMode, string> = {
  office: "Văn phòng",
  remote: "Từ xa",
};

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function formatMinutes(min: number): string {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

interface Props {
  rows: AttendanceRecord[];
  meta: PaginationMeta;
  filters: AttendanceRecordFilters;
  onFiltersChange: (next: Partial<AttendanceRecordFilters>) => void;
  isLoading?: boolean;
}

export default function AttendanceRecordTable({ rows, meta, filters, onFiltersChange, isLoading }: Props) {
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
        <Typography color="text.secondary">Không có dữ liệu chấm công trong khoảng thời gian này</Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Nhân viên</TableCell>
              <TableCell align="center">Giờ vào</TableCell>
              <TableCell align="center">Giờ ra</TableCell>
              <TableCell align="center">Đã làm</TableCell>
              <TableCell align="center">Đi muộn</TableCell>
              <TableCell align="center">OT</TableCell>
              <TableCell>Chế độ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(row.date)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{row.employeeName}</Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" fontFamily="monospace">
                    {formatTime(row.checkInAt)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" fontFamily="monospace">
                    {formatTime(row.checkOutAt)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" color={row.workedMinutes > 0 ? "success.main" : "text.disabled"}>
                    {formatMinutes(row.workedMinutes)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {row.lateMinutes > 0 ? (
                    <Typography variant="body2" color="warning.main">
                      {formatMinutes(row.lateMinutes)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">—</Typography>
                  )}
                </TableCell>

                <TableCell align="center">
                  {row.overtimeMinutes > 0 ? (
                    <Typography variant="body2" color="info.main">
                      {formatMinutes(row.overtimeMinutes)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">—</Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={WORK_MODE_LABELS[row.workMode]}
                    size="small"
                    variant="outlined"
                    color={row.workMode === "remote" ? "info" : "default"}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={STATUS_LABELS[row.status]}
                    size="small"
                    color={STATUS_COLORS[row.status]}
                    variant={row.status === "present" ? "filled" : "outlined"}
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title={row.note ?? ""} placement="top">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {row.note ?? "—"}
                    </Typography>
                  </Tooltip>
                </TableCell>
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
