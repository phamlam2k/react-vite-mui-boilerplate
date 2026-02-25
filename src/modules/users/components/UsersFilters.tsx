/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filters form for users list
 */

import type { UsersFilters } from "../_domain/users.model";
import { SEARCH_DEBOUNCE_MS } from "../_domain/users.rules";
import { useEffect, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface UsersFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

export default function UsersFilters({
  filters,
  onFiltersChange,
}: UsersFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({
        ...filters,
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch]);

  const handleRoleChange = (role: "user" | "admin" | "all") => {
    onFiltersChange({
      ...filters,
      role,
      page: 1,
    });
  };

  const handleStatusChange = (isActive: boolean | "all") => {
    onFiltersChange({
      ...filters,
      isActive,
      page: 1,
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Search */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            placeholder="Tên, email, username..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                autoComplete: "off",
              },
            }}
          />
        </Grid>

        {/* Role Filter */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Select
            value={filters.role || "all"}
            fullWidth
            onChange={e =>
              handleRoleChange(e.target.value as "user" | "admin" | "all")
            }
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="user">Người dùng</MenuItem>
            <MenuItem value="admin">Quản trị viên</MenuItem>
          </Select>
        </Grid>

        {/* Status Filter */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Select
            fullWidth
            value={
              typeof filters.isActive === "boolean"
                ? filters.isActive.toString()
                : "all"
            }
            onChange={e => {
              const value = e.target.value;
              handleStatusChange(value === "all" ? "all" : value === "true");
            }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="true">Hoạt động</MenuItem>
            <MenuItem value="false">Bị khóa</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Box>
  );
}
