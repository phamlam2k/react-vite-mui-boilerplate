/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filter bar for the attendance records list.
 * Display labels belong in UI — defined locally.
 */

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import type { AttendanceRecordFilters, AttendanceStatus } from "@modules/attendance/_domain/attendance.model";

const STATUS_OPTIONS: Array<{ value: AttendanceStatus | "all"; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "present", label: "Có mặt" },
  { value: "absent", label: "Vắng mặt" },
  { value: "late", label: "Đi muộn" },
  { value: "half_day", label: "Nửa ngày" },
  { value: "corrected", label: "Đã điều chỉnh" },
];

interface Props {
  filters: AttendanceRecordFilters;
  onFiltersChange: (next: Partial<AttendanceRecordFilters>) => void;
}

export default function AttendanceRecordFiltersBar({ filters, onFiltersChange }: Props) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
      <TextField
        label="Từ ngày"
        type="date"
        size="small"
        required
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.dateFrom}
        onChange={(e) => onFiltersChange({ dateFrom: e.target.value, page: 1 })}
        sx={{ minWidth: 160 }}
      />

      <TextField
        label="Đến ngày"
        type="date"
        size="small"
        required
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.dateTo}
        onChange={(e) => onFiltersChange({ dateTo: e.target.value, page: 1 })}
        sx={{ minWidth: 160 }}
      />

      <TextField
        select
        label="Trạng thái"
        size="small"
        value={filters.status ?? "all"}
        onChange={(e) =>
          onFiltersChange({ status: e.target.value as AttendanceStatus | "all", page: 1 })
        }
        sx={{ minWidth: 180 }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
