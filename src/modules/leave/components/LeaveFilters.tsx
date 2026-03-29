import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import type { LeaveFilters as Filters } from "../_domain/leave.model";

type Props = { filters: Filters; onChange: (next: Partial<Filters>) => void };

export default function LeaveFilters({ filters, onChange }: Props) {
  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        size="small"
        label="Search"
        value={filters.search ?? ""}
        onChange={(e) => onChange({ search: e.target.value })}
      />
    </Box>
  );
}
