/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filters form for employees list
 */

import type { EmployeesFilters as EmployeesFiltersType } from "../_domain/employees.model";
import { SEARCH_DEBOUNCE_MS } from "../_domain/employees.rules";
import { useEffect, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import { useOrgUnitsList } from "@shared/apis/orgUnits.hook";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { STATUS_LABELS, WORK_MODE_LABELS } from "../_domain/employees.rules";

interface EmployeesFiltersProps {
  filters: EmployeesFiltersType;
  onFiltersChange: (filters: EmployeesFiltersType) => void;
}

const statusFilterOptions = [
  { value: "all", label: "Tất cả" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

const workModeFilterOptions = [
  { value: "all", label: "Tất cả" },
  ...Object.entries(WORK_MODE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

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
      onFiltersChange({
        ...filters,
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch]);

  const handleOrgUnitChange = (orgUnitId: string) => {
    onFiltersChange({
      ...filters,
      orgUnitId: orgUnitId === "" ? undefined : orgUnitId,
      page: 1,
    });
  };

  const handleStatusChange = (status: EmployeesFiltersType["status"]) => {
    onFiltersChange({
      ...filters,
      status: status ?? "all",
      page: 1,
    });
  };

  const handleWorkModeChange = (workMode: EmployeesFiltersType["workMode"]) => {
    onFiltersChange({
      ...filters,
      workMode: workMode ?? "all",
      page: 1,
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            placeholder="Tên, email, mã nhân viên..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                autoComplete: "off",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Select
            value={filters.orgUnitId ?? ""}
            onChange={e => handleOrgUnitChange(e.target.value)}
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
              handleStatusChange(
                e.target.value as EmployeesFiltersType["status"]
              )
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
              handleWorkModeChange(
                e.target.value as EmployeesFiltersType["workMode"]
              )
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
