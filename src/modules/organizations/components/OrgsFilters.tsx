/**
 * 🟡 ADAPTER LAYER - UI Component
 * Search + type + isActive filters for org units list
 */

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import type { OrgUnitType, OrgsFilters } from "@modules/organizations/_domain/organizations.model";
import { useDebounce } from "@shared/hooks/useDebounce";

// UI/presentation concerns — không thuộc Domain layer
const SEARCH_DEBOUNCE_MS = 500;

const ORG_TYPE_LABELS: Record<OrgUnitType, string> = {
  company: "Công ty",
  business_unit: "Đơn vị kinh doanh",
  department: "Phòng ban",
  team: "Nhóm",
};

interface OrgsFiltersProps {
  filters: OrgsFilters;
  onFiltersChange: (next: Partial<OrgsFilters>) => void;
}

const typeOptions = [
  { value: "all", label: "Tất cả loại" },
  ...Object.entries(ORG_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Ngừng hoạt động" },
];

export default function OrgsFilters({
  filters,
  onFiltersChange,
}: OrgsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? "")) {
      onFiltersChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const handleTypeChange = (value: string) => {
    onFiltersChange({ type: value as OrgsFilters["type"], page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive =
      value === "all" ? "all" : value === "true" ? true : false;
    onFiltersChange({ isActive: isActive as OrgsFilters["isActive"], page: 1 });
  };

  const currentStatus =
    filters.isActive === "all" || filters.isActive === undefined
      ? "all"
      : String(filters.isActive);

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <TextField
        sx={{ flex: 2, minWidth: 220 }}
        placeholder="Tìm theo tên đơn vị..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        slotProps={{ input: { autoComplete: "off" } }}
      />

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Loại đơn vị</InputLabel>
        <Select
          value={filters.type ?? "all"}
          label="Loại đơn vị"
          onChange={e => handleTypeChange(e.target.value)}
        >
          {typeOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          value={currentStatus}
          label="Trạng thái"
          onChange={e => handleStatusChange(e.target.value)}
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
