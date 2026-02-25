import { Checkbox, TableCell, TableHead, TableRow } from "@mui/material";

import type { IBaseTableHeadProps } from "@shared/types/table.type";

const BaseTableHead = <TData,>(props: IBaseTableHeadProps<TData>) => {
  const {
    indeterminate,
    checked,
    ordinalNumber,
    columns,
    hasCheckBox,
    customStyle,
    isLoading,
    handleSelectdAllClick,
  } = props;

  return (
    <TableHead
      sx={{
        ...(customStyle && { ...customStyle }),
      }}
    >
      <TableRow>
        {hasCheckBox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={!isLoading && indeterminate}
              checked={!isLoading && checked}
              onChange={handleSelectdAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        {ordinalNumber && <TableCell>Ordinal Number</TableCell>}
        {columns.map(column => (
          <TableCell
            key={column.id}
            sx={{
              ...(column.customStyle && { ...column.customStyle }),
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default BaseTableHead;
