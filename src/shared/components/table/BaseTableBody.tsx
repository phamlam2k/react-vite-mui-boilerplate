import { Checkbox, TableBody, TableCell, TableRow } from "@mui/material";

import get from "lodash-es/get";

import type { IBaseTableBodyProps } from "@shared/types/table.type";

const BaseTableBody = <TData,>(props: IBaseTableBodyProps<TData>) => {
  const {
    data,
    listSelected,
    columns,
    checkedIndex,
    hasCheckBox,
    customStyle,
    ordinalNumber,
    pagination,

    actions,
    handleSelectRow,
  } = props;

  return (
    <TableBody
      sx={{
        ...(customStyle && { ...customStyle }),
      }}
    >
      {data.map((row, index) => {
        return (
          <TableRow key={index}>
            {hasCheckBox && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    checkedIndex &&
                    listSelected.indexOf(row[checkedIndex] as never) !== -1
                  }
                  onChange={() =>
                    handleSelectRow(
                      checkedIndex && (row[checkedIndex] as never)
                    )
                  }
                />
              </TableCell>
            )}
            {pagination
              ? ordinalNumber && (
                  <TableCell>
                    {index * pagination.limit * pagination.page}
                  </TableCell>
                )
              : ordinalNumber && <TableCell>{index + 1}</TableCell>}
            {columns.map(headCell => (
              <TableCell
                key={headCell.id}
                sx={{
                  ...(headCell.customStyle && { ...headCell.customStyle }),
                }}
              >
                {headCell.render
                  ? headCell.render(
                      row,
                      actions as (key: string, data: TData) => void
                    )
                  : headCell.key && (get(row, headCell.key) as string)}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default BaseTableBody;
