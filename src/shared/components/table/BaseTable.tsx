import { useMemo, useState, forwardRef, useImperativeHandle } from "react";

import { Paper, Table, TableContainer } from "@mui/material";

import type { IBaseTableProps } from "@shared/types/table.type";
import BaseTableLoading from "@shared/components/table/BaseTableLoading";
import BaseTableNoData from "@shared/components/table/BaseTableNoData";
import BaseTableBody from "@shared/components/table/BaseTableBody";
import BaseTableHead from "@shared/components/table/BaseTableHead";
import BasePagination from "@shared/components/table/BasePagination";

/**
 *
 * @param data Dữ liệu của bảng
 *
 * @param columns Các cột của bảng
 *
 * @param pagination Phân trang
 *
 * @param checkedIndex Key của dữ liệu được chọn
 *
 * @param hasCheckBox Hiển thị checkbox
 *
 * @param isLoading Đang tải dữ liệu
 *
 * @param headerStyle Style của header
 *
 * @param bodyStyle Style của body
 *
 * @param ordinalNumber Hiển thị số thứ tự
 *
 * @param actions Hành động
 *
 * @param {function} handleCheckRowId Callback khi chọn dữ liệu - return boolean
 *
 * @returns
 */
const BaseTable = <TData,>(props: IBaseTableProps<TData>, ref: any) => {
  const {
    data,
    columns,
    pagination,
    checkedIndex,
    hasCheckBox = true,
    isLoading,
    customStyle,
    headerStyle,
    bodyStyle,
    ordinalNumber,

    actions,
    handleCheckRowId,
  } = props;

  const [listSelected, setListSelected] = useState<TData[keyof TData][]>([]);

  useImperativeHandle(ref, () => ({
    handleSelectRow: (id: TData[keyof TData] | undefined) => {
      if (!id) return;

      const selectedIndex = listSelected.indexOf(id);

      if (selectedIndex === -1) {
        setListSelected([...listSelected, id]);
      } else {
        setListSelected(listSelected.filter(n => n !== id));
      }
    },
    handleSeleteIdList: (ids: TData[keyof TData][]) => {
      console.log(ids);
      setListSelected(ids);
    },
  }));

  const handleSelectdAllClick = () => {
    if (
      listSelected.length === (pagination?.totalElements || data.length) ||
      !checkedIndex
    ) {
      setListSelected([]);

      return;
    }

    const newSelecteds = data.map(n => n[checkedIndex]);

    if (typeof handleCheckRowId === "undefined") {
      setListSelected(newSelecteds);

      return;
    }

    const _handleCheckRowId = handleCheckRowId(newSelecteds);

    if (_handleCheckRowId === undefined) {
      setListSelected(newSelecteds);
    }

    if (_handleCheckRowId) {
      setListSelected(newSelecteds);
    }
  };

  const handleSelectRow = (id: TData[keyof TData] | undefined) => {
    if (!id) return;

    const selectedIndex = listSelected.indexOf(id);
    let newSelected: TData[keyof TData][] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(listSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(listSelected.slice(1));
    } else if (selectedIndex === listSelected.length - 1) {
      newSelected = newSelected.concat(listSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        listSelected.slice(0, selectedIndex),
        listSelected.slice(selectedIndex + 1)
      );
    }

    if (typeof handleCheckRowId === "undefined") {
      setListSelected(newSelected);

      return;
    }

    const _handleCheckRowId = handleCheckRowId(newSelected);

    if (_handleCheckRowId === undefined) {
      setListSelected(newSelected);
    }

    if (_handleCheckRowId) {
      setListSelected(newSelected);
    }
  };

  const contentTableBody = useMemo(() => {
    let numberColumns = columns.length;

    if (hasCheckBox) {
      numberColumns += 1;
    }

    if (ordinalNumber) {
      numberColumns += 1;
    }

    if (isLoading) {
      return (
        <BaseTableLoading
          columns={columns}
          hasCheckBox={hasCheckBox}
          ordinalNumber={ordinalNumber}
        />
      );
    }

    if (data.length === 0) {
      return <BaseTableNoData numberColumns={numberColumns} />;
    }

    return (
      <BaseTableBody
        data={data}
        columns={columns}
        ordinalNumber={ordinalNumber}
        hasCheckBox={hasCheckBox}
        checkedIndex={checkedIndex}
        listSelected={listSelected}
        customStyle={bodyStyle}
        handleSelectRow={handleSelectRow}
        actions={actions}
      />
    );
  }, [
    actions,
    ordinalNumber,
    checkedIndex,
    columns,
    data,
    hasCheckBox,
    isLoading,
    listSelected,
  ]);

  return (
    <Paper sx={{ width: "100%", background: "transparent" }}>
      <TableContainer
        ref={ref}
        sx={{
          width: "inherit",
          maxHeight: "400px",
          position: "relative",
          ...(customStyle && { ...customStyle }),
        }}
      >
        <Table stickyHeader aria-label="simple table">
          <BaseTableHead
            isLoading={isLoading || false}
            columns={columns}
            hasCheckBox={hasCheckBox}
            ordinalNumber={ordinalNumber}
            customStyle={headerStyle}
            indeterminate={
              listSelected.length > 0 &&
              listSelected.length < (pagination?.totalElements || data.length)
            }
            checked={
              !!data.length &&
              !!(
                listSelected.length ===
                (pagination?.totalElements || data.length)
              )
            }
            handleSelectdAllClick={handleSelectdAllClick}
          />
          {contentTableBody}
        </Table>
      </TableContainer>
      {pagination && (
        <BasePagination
          page={pagination?.page || 1}
          limit={pagination?.limit || 10}
          totalPage={pagination?.totalPage || 1}
          handleChangePagination={pagination?.handleChangePagination}
        />
      )}
    </Paper>
  );
};

BaseTable.displayName = "BaseTable";

export default forwardRef(BaseTable) as <TData>(
  props: IBaseTableProps<TData> & { ref?: any }
) => React.ReactElement;
