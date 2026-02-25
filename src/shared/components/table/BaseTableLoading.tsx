import { TableBody, TableCell, TableRow } from "@mui/material";

import type { IBaseTableLoadingProps } from "@shared/types/table.type";

const BaseTableLoading = <TData,>(props: IBaseTableLoadingProps<TData>) => {
  const { columns, hasCheckBox, ordinalNumber } = props;

  return (
    <TableBody>
      {Array.from({ length: 10 }).map((_, index: number) => (
        <TableRow key={`table_row_${index}`}>
          {hasCheckBox && (
            <TableCell padding="checkbox">
              <div className="animate-pulse p-[11px]">
                <div className="w-[19px] h-[19px] bg-gray-200 rounded-sm dark:bg-gray-700" />
              </div>
            </TableCell>
          )}
          {ordinalNumber && <TableCell>{index + 1}</TableCell>}
          {columns.map(headCell => (
            <TableCell
              key={headCell.id}
              sx={{
                ...(headCell.customStyle && { ...headCell.customStyle }),
              }}
            >
              <div className="w-full animate-pulse">
                <div className="h-[25px] w-full bg-gray-200 rounded-sm dark:bg-gray-700" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default BaseTableLoading;
