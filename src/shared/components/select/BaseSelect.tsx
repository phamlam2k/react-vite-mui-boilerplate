// @ts-check

import type { HTMLAttributes, SyntheticEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { SelectProps, TextFieldProps } from "@mui/material";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { List, type RowComponentProps } from "react-window";
import { useInfiniteLoader } from "react-window-infinite-loader";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";

import type { IOptions } from "@shared/types/common.type";
import {
  LoadingContainerStyled,
  OpitonListContainerStyled,
  OptionSelectAllStyled,
  OptionsEmptyStyled,
  TootipChipSelectStyled,
} from "./BaseSelect.styled";

const heightOption = 55;
const optionShowingNumDefault = 4;

type SelectRowProps<TValue> = {
  optionsBySearch: IOptions<TValue>[];
  value: TValue | TValue[];
  multiple?: boolean;
  isRowLoaded: (index: number) => boolean;
  handleChangeValue: (
    e: React.SyntheticEvent,
    option: IOptions<TValue>
  ) => void;
};

interface BaseSelectApiProps {
  onFetchNextPage: () => void;
  isLoadingOptions: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ConditionalType<T> = T extends true
  ? BaseSelectApiProps
  : Partial<BaseSelectApiProps>;

export interface BaseSelectChildProps<TValue> extends Omit<
  SelectProps<TValue>,
  "value" | "onChange" | "variant" | "multiple"
> {
  value: TValue extends any
    ? TValue extends TValue | TValue[]
      ? TValue
      : never
    : never;
  options: IOptions<TValue>[];
  hasSearchBox?: boolean;
  searchboxProps?: TextFieldProps;
  multiple?: boolean;
  optionShowingNum?: number;

  onFilter?: (searchValue: string) => void;

  // Using for Select API
  hasApi?: boolean;

  // Optional placeholder text (custom, not native MUI prop)
  placeholder?: string;

  onChange: (data: TValue | TValue[]) => void;
}

export type BaseSelectProps<T> = Expand<
  BaseSelectChildProps<T> & ConditionalType<BaseSelectChildProps<T>["hasApi"]>
>;

/**
 * --------- Đây là base component select được dùng cho dự án ----------
 *
 * @component
 * @param value - Giá trị của select không dùng typescript là any
 *
 * @param options - Danh sách option trong select
 *
 * @param onChange - Hàm xử lý khi thay đổi giá trị
 *
 * @param rest - Các props khác của SelectMUI
 *
 * @param hasSearchBox - Hiển thị search box
 *
 * @param searchboxProps - Các props của search box
 *
 * @param multiple - Cho phép chọn nhiều giá trị dưa theo giá trị của value là mảng hoặc không
 *
 * @param optionShowingNum - Số lượng option hiển thị mặc định
 *
 * ------------------ Dùng cho call API ở Select ----------------------
 *
 * @param hasApi - Sử dụng API
 *
 * @param onFetchNextPage - Hàm fetch next page load more
 *
 * @param onFilter {(searchingValue: string) => void} Hàm filter: searching từ input search
 *
 * @param isLoadingOptions - Trạng thái loading khi lần đầu load các options
 *
 * @param hasNextPage - Kiểm tra xem còn trang tiếp theo không
 *
 * @param isFetchingNextPage - Trạng thái loading khi fetch next page
 *
 * @returns JSX.Element
 *
 * @author Pham Ngoc Mai Lam
 *
 */
const BaseSelect = <TValue,>(props: BaseSelectProps<TValue>) => {
  const {
    value,
    options,
    hasSearchBox,
    searchboxProps,
    fullWidth = true,
    isLoadingOptions,
    optionShowingNum,
    disabled,
    readOnly,

    hasApi,
    hasNextPage,
    isFetchingNextPage,

    onChange,
    onFilter,
    onFetchNextPage,

    ...rest
  } = props;

  const selectRef = useRef<HTMLDivElement | null>(null);
  const searchBoxRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Search value
  const [optionsBySearch, setOptionsBySearch] =
    useState<IOptions<TValue>[]>(options);
  const [numberTagname, setNumberTagname] = useState(0);

  const isValidValue = useMemo(() => {
    return Array.isArray(value) ? value.length !== 0 : !!value;
  }, [value]);

  // UseEffect for set number tagname and catch event resize
  useEffect(() => {
    if (!options && isLoadingOptions) return;

    setOptionsBySearch(options);
  }, [options]);

  useEffect(() => {
    if (!value || !Array.isArray(value) || !selectRef) return;

    setNumberTagname(getNumberTagname());
  }, [value]);

  useEffect(() => {
    if (!Array.isArray(value)) return;

    const handleResize = () => {
      setNumberTagname(getNumberTagname());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
  // --------------------------------------------------------
  // ----------------- Action for search --------------------
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);

    if (hasApi) {
      onFilter && onFilter(event.target.value);
    } else {
      const opt = [...options].filter(option =>
        option.label
          .toString()
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );

      setOptionsBySearch(opt);
    }
  };

  const handleDelete = (val: string | number) => {
    if (!Array.isArray(value)) return;

    onChange([...value].filter(option => option !== val));
  };

  const handleChangeValue = (
    e: React.SyntheticEvent,
    option: IOptions<TValue>
  ) => {
    e.stopPropagation();

    if (props.multiple && Array.isArray(value)) {
      if (value.includes(option.value)) {
        onChange([...value].filter(val => val !== option.value));
      } else {
        onChange([...value, option.value]);
      }
    } else {
      onChange(option.value);
      handleClose(e);
    }
  };

  const handleClearData = () => {
    onChange((props.multiple ? [] : "") as TValue);
  };

  // ---------------------------------------------------------
  // ------------ Action for open and select ----------------
  const handleOpen = () => {
    if (readOnly || disabled) return;

    setOpen(true);
  };

  const handleClose = (e: SyntheticEvent) => {
    if (e.currentTarget.contains(searchBoxRef.current)) return;

    setSearchValue("");
    setOptionsBySearch(options);
    setOpen(false);
  };

  // ---------------------------------------------------------
  // ----------------- Action for select all -----------------
  const handleCheckAll = () => {
    if (Array.isArray(value) && value.length === optionsBySearch.length) {
      onChange([]);
    } else {
      onChange(optionsBySearch.map(option => option.value));
    }
  };

  const getNumberTagname = () => {
    let totalTagShowing = 0;

    const listChipSelect = document.querySelectorAll(".chip-select");

    const widthInput = selectRef.current?.clientWidth
      ? selectRef.current.clientWidth - 120
      : 0;

    for (let i = 0; i < listChipSelect.length; i++) {
      const chipSelect = listChipSelect[i] as HTMLElement;

      if (chipSelect.offsetLeft + chipSelect.offsetWidth > widthInput) {
        break;
      }

      totalTagShowing++;
    }

    return totalTagShowing;
  };

  const renderValue = useCallback(
    (selected: TValue) => {
      if (Array.isArray(selected)) {
        const selectdItemShowing = [...selected].slice(0, numberTagname);

        const renderChip = function (
          value: TValue,
          index: number
        ): (props: { className?: string }) => React.ReactElement {
          return ({ className }) => {
            const selectedItem = options?.find(
              option => option.value === value
            );

            return (
              <Chip
                onMouseDown={e => {
                  e.stopPropagation();
                }}
                sx={{
                  margin: "2px",
                  paddingRight: "5px",
                }}
                key={`chip-${String(value)}-${index}`}
                className={className}
                label={
                  <TootipChipSelectStyled title={selectedItem?.label}>
                    <Typography>{selectedItem?.label}</Typography>
                  </TootipChipSelectStyled>
                }
                onClick={handleOpen}
                onDelete={() => handleDelete(value as string | number)}
                deleteIcon={<CloseIcon style={{ cursor: "pointer" }} />}
              />
            );
          };
        };

        return (
          <>
            <Box
              display="flex"
              width="100%"
              visibility="hidden"
              position="absolute"
              overflow="hidden"
            >
              {selected.map((value, index) =>
                renderChip(value, index)({ className: "chip-select" })
              )}
            </Box>
            <Box display="flex">
              {selectdItemShowing.map((value, index) =>
                renderChip(value, index)({ className: "chip-select-showing" })
              )}

              {selectdItemShowing.length > 0 &&
                selected.length - selectdItemShowing.length > 0 && (
                  <Chip
                    sx={{
                      margin: "2px",
                    }}
                    label={
                      <Typography>
                        + {selected.length - selectdItemShowing.length}
                      </Typography>
                    }
                  />
                )}
            </Box>
          </>
        );
      }

      return (
        <div className="flex items-center gap-2">
          {options &&
            options?.find(option => option.value === selected)?.iconLabel}

          <Typography width="100%" textOverflow="ellipsis" overflow="hidden">
            {options &&
              options?.find(option => option.value === selected)?.label}
          </Typography>
        </div>
      );
    },
    [options, numberTagname]
  );

  // --------------------- Render Select API ---------------------------
  const itemCount = hasNextPage
    ? optionsBySearch.length + 1
    : optionsBySearch.length;

  // react-window-infinite-loader v2 expects isRowLoaded/loadMoreRows/rowCount
  const isRowLoaded = (index: number) => {
    return isFetchingNextPage || !hasNextPage || index < optionsBySearch.length;
  };

  const loadMoreRows =
    onFetchNextPage && hasApi && hasNextPage
      ? async (_startIndex: number, _stopIndex: number) => {
          onFetchNextPage();
        }
      : async () => {};

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount: itemCount,
  });

  const RowComponent = ({
    index,
    style,
    optionsBySearch,
    value,
    multiple,
    isRowLoaded: rowLoaded,
    handleChangeValue: onChangeValue,
  }: RowComponentProps<SelectRowProps<TValue>>) => {
    if (!rowLoaded(index) || !optionsBySearch[index]) {
      return (
        <LoadingContainerStyled style={style}>
          <CircularProgress size={20} />
        </LoadingContainerStyled>
      );
    }

    const option = optionsBySearch[index];

    return (
      <MenuItem
        key={`menu-item-${option.value}-${index}`}
        value={option.value as string | number}
        onClick={e => onChangeValue(e, option)}
        sx={{
          padding: "8px 16px",
          display: "flex",
          gap: "10px",
          ...style,
        }}
      >
        {multiple && Array.isArray(value) && (
          <Checkbox checked={value.includes(option.value as TValue)} />
        )}
        <Tooltip
          title={option.label}
          sx={{
            flex: 1,
          }}
          placement="bottom-start"
        >
          <div className="flex items-center gap-2">
            {option.iconLabel && option.iconLabel}
            <Typography width="100%" textOverflow="ellipsis" overflow="hidden">
              {option.label}
            </Typography>
          </div>
        </Tooltip>
      </MenuItem>
    );
  };

  return (
    <Select
      {...rest}
      ref={selectRef}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={renderValue}
      endAdornment={
        !disabled &&
        isValidValue &&
        !readOnly && <CloseIconAdornment onClick={handleClearData} />
      }
      disabled={disabled}
      value={(value ?? (props.multiple ? [] : "")) as TValue}
      sx={{
        "& .MuiSelect-select span::before": {
          opacity: "0.4",
          content:
            ((Array.isArray(value) && value.length === 0) ||
              !Array.isArray(value)) &&
            "placeholder" in rest &&
            rest.placeholder
              ? `'${rest.placeholder}'`
              : `''`,
        },

        ...(props?.sx && { ...props.sx }),
      }}
      MenuProps={{
        autoFocus: false,
        sx: {
          maxHeight: 500,
        },
      }}
      fullWidth={fullWidth}
    >
      <Box ref={searchBoxRef} width="100%">
        {hasSearchBox && (
          <Box padding={1} width="100%">
            <TextField
              role="searchbox"
              id="search-box-select"
              autoFocus
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              value={searchValue}
              onChange={handleSearch}
              size="small"
              fullWidth
              {...(searchboxProps && searchboxProps)}
            />
          </Box>
        )}
        {props.multiple &&
          Array.isArray(value) &&
          optionsBySearch.length !== 0 && (
            <OptionSelectAllStyled onClick={handleCheckAll} role="menuitem">
              <Checkbox
                checked={value.length === optionsBySearch.length}
                indeterminate={
                  value.length > 0 && value.length < optionsBySearch.length
                }
              />
              <Typography lineHeight="15px">Select All</Typography>
            </OptionSelectAllStyled>
          )}
      </Box>
      {isLoadingOptions ? (
        <LoadingContainerStyled>
          <CircularProgress />
        </LoadingContainerStyled>
      ) : optionsBySearch.length === 0 ? (
        <BaseOptionsEmpty />
      ) : (
        <OpitonListContainerStyled>
          <List<SelectRowProps<TValue>>
            rowComponent={RowComponent}
            rowCount={itemCount}
            rowHeight={heightOption}
            rowProps={{
              optionsBySearch,
              value: value as TValue | TValue[],
              multiple: props.multiple,
              isRowLoaded,
              handleChangeValue,
            }}
            onRowsRendered={onRowsRendered}
            style={{
              height:
                itemCount < (optionShowingNum ?? optionShowingNumDefault)
                  ? heightOption * itemCount
                  : heightOption *
                    (optionShowingNum ?? optionShowingNumDefault),
              width: "100%",
            }}
          />
        </OpitonListContainerStyled>
      )}
    </Select>
  );
};

const CloseIconAdornment = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="mr-6 flex items-center cursor-pointer" {...props}>
      <CloseIcon />
    </div>
  );
};

const BaseOptionsEmpty = () => {
  return (
    <OptionsEmptyStyled>
      <BlockIcon />
    </OptionsEmptyStyled>
  );
};

export default BaseSelect;
