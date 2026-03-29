/**
 * 🟡 ADAPTER LAYER - UI Component
 * Filters for roles list (search + debounce)
 */

import type { RolesFilters as RolesFiltersType } from "@modules/roles_permissions/_domain/roles/roles.model";
import { useEffect, useState } from "react";

// UI/presentation concern — không thuộc Domain layer
const SEARCH_DEBOUNCE_MS = 500;
import { useDebounce } from "@shared/hooks/useDebounce";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface RolesFiltersProps {
  filters: RolesFiltersType;
  onFiltersChange: (filters: RolesFiltersType) => void;
}

export default function RolesFilters({
  filters,
  onFiltersChange,
}: RolesFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? "")) {
      onFiltersChange({
        ...filters,
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch]);

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Tìm theo tên vai trò..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        slotProps={{
          input: {
            autoComplete: "off",
          },
        }}
      />
    </Box>
  );
}
