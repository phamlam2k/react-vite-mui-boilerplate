import type { CSSProperties } from "react";

export interface IColumnTable extends CSSProperties {
  id: string;
  label: string;
}

export interface ITableColumnsBonus {
  index: number;
}

export interface IColumnBaseTable<TData> {
  id: string;
  key?: keyof TData;
  label: string;
  customStyle?: CSSProperties;
  render?: (
    data: TData,
    callBack: (key: string, data: TData) => void
  ) => React.ReactNode | string;
}

export interface IBasePaginationProps {
  page: number;
  totalPage: number;
  limit: number;
  totalElements?: number;
  handleChangePagination: (page: number, limit: number) => void;
}

export interface IBaseTableContextProps<TData> {
  data: TData[];
  hasCheckBox?: boolean;
  checkedIndex?: keyof TData;
  columns: IColumnBaseTable<TData>[];
  actions?: (type: string, data: TData) => void;
}

export interface IBaseTableProps<TData> extends IBaseTableContextProps<TData> {
  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  customStyle?: CSSProperties;
  pagination?: IBasePaginationProps;
  isLoading?: boolean;
  ordinalNumber?: boolean;

  handleCheckRowId?: (ids: TData[keyof TData][]) => boolean;
}

export interface IBaseTableBodyProps<
  TData,
> extends IBaseTableContextProps<TData> {
  listSelected: TData[keyof TData][];
  ordinalNumber?: boolean;
  customStyle?: CSSProperties;
  pagination?: IBasePaginationProps;

  handleSelectRow: (id: TData[keyof TData] | undefined) => void;
}

export interface IBaseTableLoadingProps<TData> extends Pick<
  IBaseTableBodyProps<TData>,
  "columns" | "ordinalNumber" | "hasCheckBox"
> {}

export interface IBaseTableHeadProps<TData> extends Pick<
  IBaseTableContextProps<TData>,
  "columns" | "hasCheckBox"
> {
  isLoading: boolean;
  indeterminate: boolean;
  checked: boolean;
  columns: IColumnBaseTable<TData>[];
  customStyle?: CSSProperties;
  ordinalNumber?: boolean;

  handleSelectdAllClick: () => void;
}

export interface IColumnTableCollapse<TData> {
  id: string;
  key?: keyof TData;
  label: string;
  customStyle?: CSSProperties;
  render?: (
    data: TData,
    callBack: (key: string) => void
  ) => React.ReactNode | string;
}

export interface ITableCollapseProps<TData, TDataByKey> extends Omit<
  IBaseTableContextProps<TData>,
  "hasCheckBox" | "data" | "columns"
> {
  collapseIndex: keyof TData;
  data: TData[];

  columns: IColumnTableCollapse<TDataByKey>[];

  buttonHeader?: (row: TData) => React.ReactNode;

  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  customStyle?: CSSProperties;
  pagination?: IBasePaginationProps;
}

export interface ITableCollapseHeaderProps<TData, TDataByKey> extends Pick<
  ITableCollapseProps<TData, TDataByKey>,
  "columns" | "headerStyle"
> {}

export interface ITableCollapseBodyProps<TData, TDataByKey> extends Omit<
  ITableCollapseProps<TData, TDataByKey>,
  "customStyle" | "headerStyle" | "pagination"
> {}
