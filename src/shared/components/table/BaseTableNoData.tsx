import { TableBody, TableCell, TableRow, Typography } from "@mui/material";

const BaseTableNoData = ({ numberColumns }: { numberColumns: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={numberColumns} className="h-[340px]">
          <div className="absolute top-[calc(50%+25px)] left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit">
            <Typography variant="h3">Nodata</Typography>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default BaseTableNoData;
