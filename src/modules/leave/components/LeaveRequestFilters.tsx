/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filter bar for the leave request list.
 * Display labels + debounce are UI concerns — defined locally.
 */

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import type {
  ILeaveRequestFilters,
  LeaveStatus,
} from "@modules/leave/_domain/leave.model";
import { useLeavePolicies } from "../hooks/useLeavePolicies";

const SEARCH_DEBOUNCE_MS = 400;

const STATUS_OPTIONS: Array<{ value: LeaveStatus | "all"; label: string }> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "draft", label: "Nháp" },
  { value: "submitted", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "cancelled", label: "Đã hủy" },
];

interface Props {
  filters: ILeaveRequestFilters;
  onFiltersChange: (next: Partial<ILeaveRequestFilters>) => void;
}

let debounceTimer: ReturnType<typeof setTimeout>;

export default function LeaveRequestFilters({
  filters,
  onFiltersChange,
}: Props) {
  const { data: policies } = useLeavePolicies();

  const handleDateChange = (field: "dateFrom" | "dateTo", value: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onFiltersChange({ [field]: value || undefined });
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
      <TextField
        select
        label="Trạng thái"
        size="small"
        value={filters.status ?? "all"}
        onChange={e =>
          onFiltersChange({
            status: e.target.value as LeaveStatus | "all",
            page: 1,
          })
        }
        sx={{ minWidth: 180 }}
      >
        {STATUS_OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Loại nghỉ phép"
        size="small"
        value={filters.policyCode ?? ""}
        onChange={e =>
          onFiltersChange({ policyCode: e.target.value || undefined, page: 1 })
        }
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">Tất cả loại</MenuItem>
        {policies?.map(p => (
          <MenuItem key={p.code} value={p.code}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Từ ngày"
        type="date"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        defaultValue={filters.dateFrom ?? ""}
        onChange={e => handleDateChange("dateFrom", e.target.value)}
        sx={{ minWidth: 160 }}
      />

      <TextField
        label="Đến ngày"
        type="date"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        defaultValue={filters.dateTo ?? ""}
        onChange={e => handleDateChange("dateTo", e.target.value)}
        sx={{ minWidth: 160 }}
      />
    </Box>
  );
}
