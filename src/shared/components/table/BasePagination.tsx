import type { SelectChangeEvent } from "@mui/material";
import { MenuItem, Pagination, Typography } from "@mui/material";

import {
  LimitContentStyled,
  PaginationContainerStyled,
  SelectStyled,
} from "./table.styled";

type IBasePaginationProps = {
  page: number;
  limit: number;
  totalPage: number;
  handleChangePagination?: (page: number, limit: number) => void;
};

const LIST_LIMITS = [10, 20, 50, 100];

const BasePagination = (props: IBasePaginationProps) => {
  const { page = 1, limit = 10, totalPage = 1, handleChangePagination } = props;

  const handleChangePage = (_: unknown, page: number) => {
    handleChangePagination && handleChangePagination(page, limit);
  };

  const handleChangeLimit = (event: SelectChangeEvent<unknown>) => {
    handleChangePagination &&
      handleChangePagination(1, Number(event.target.value));
  };

  return (
    <PaginationContainerStyled>
      <LimitContentStyled>
        <Typography>Số dòng hiển thị</Typography>
        <SelectStyled
          defaultValue={limit}
          variant="outlined"
          onChange={handleChangeLimit}
        >
          {LIST_LIMITS.map((limit, index) => (
            <MenuItem key={index} value={limit}>
              {limit}
            </MenuItem>
          ))}
        </SelectStyled>
      </LimitContentStyled>
      <Pagination
        page={page}
        count={totalPage}
        shape="rounded"
        onChange={handleChangePage}
      />
    </PaginationContainerStyled>
  );
};

export default BasePagination;
