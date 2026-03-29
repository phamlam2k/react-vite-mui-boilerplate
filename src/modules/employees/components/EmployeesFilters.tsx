/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filters form for employees list
 */

import type { EmployeesFilters as EmployeesFiltersType } from "../_domain/employees.model";
import { useEffect, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import { useOrgUnitsList } from "@shared/apis/orgUnits.hook";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// UI/presentation concerns — không thuộc Domain layer
const SEARCH_DEBOUNCE_MS = 500;

const statusFilterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "probation", label: "Thử việc" },
  { value: "active", label: "Đang làm việc" },
  { value: "on_leave", label: "Nghỉ phép" },
  { value: "terminated", label: "Đã nghỉ" },
];

const workModeFilterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "office", label: "Văn phòng" },
  { value: "remote", label: "Làm từ xa" },
  { value: "hybrid", label: "Kết hợp" },
];

interface EmployeesFiltersProps {
  filters: EmployeesFiltersType;
  onFiltersChange: (filters: EmployeesFiltersType) => void;
}

export default function EmployeesFilters({
  filters,
  onFiltersChange,
}: EmployeesFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  const { data: orgUnitsData } = useOrgUnitsList({
    page: 1,
    pageSize: 500,
    isActive: true,
  });
  const orgUnitOptions = orgUnitsData?.data ?? [];

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? "")) {
      onFiltersChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            placeholder="Tên, email, mã nhân viên..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            slotProps={{ input: { autoComplete: "off" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Select
            value={filters.orgUnitId ?? ""}
            onChange={e =>
              onFiltersChange({
                ...filters,
                orgUnitId: e.target.value === "" ? undefined : e.target.value,
                page: 1,
              })
            }
          >
            <MenuItem value="">Tất cả</MenuItem>
            {orgUnitOptions.map(ou => (
              <MenuItem key={ou.id} value={ou.id}>
                {ou.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Select
            value={filters.status ?? "all"}
            onChange={e =>
              onFiltersChange({
                ...filters,
                status: e.target.value as EmployeesFiltersType["status"],
                page: 1,
              })
            }
          >
            {statusFilterOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Select
            value={filters.workMode ?? "all"}
            onChange={e =>
              onFiltersChange({
                ...filters,
                workMode: e.target.value as EmployeesFiltersType["workMode"],
                page: 1,
              })
            }
          >
            {workModeFilterOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </Box>
  );
}
