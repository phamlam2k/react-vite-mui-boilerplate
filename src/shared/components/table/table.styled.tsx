import styled from "@emotion/styled";
import { Select } from "@mui/material";
import styledMui from "@mui/material/styles/styled";

/**
 * Container for pagination controls
 * Displays pagination and page size selector in a row
 */
export const PaginationContainerStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px 16px 24px;
`;

/**
 * Container for page size selector
 * Displays label and select input in a row
 */
export const LimitContentStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/**
 * Styled select component for page size selection
 * Customizes the MUI Select component with consistent styling
 */
export const SelectStyled = styledMui(Select)(({ theme }) => ({
  "&.MuiInputBase-root": {
    width: "80px",
    height: "40px",
    backgroundColor: "transparent",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: "0px 8px",
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiSelect-select": {
    height: "fit-content",
    padding: "8px 12px",
  },
}));
