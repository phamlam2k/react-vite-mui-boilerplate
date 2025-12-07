import type { Theme } from '@mui/material/styles'

const table: Theme['components'] = {
  MuiTable: {
    styleOverrides: {
      root: {
        borderCollapse: 'separate',
        borderSpacing: 0
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        color: 'var(--mui-palette-text-primaryChannel)',
        fontWeight: 'inherit',

        '&.MuiTableCell-head': {
          backgroundColor: 'var(--mui-palette-primary-lighterOpacity)'
        }
      }
    }
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        color: 'var(--mui-palette-text-secondary)'
      }
    }
  }
}

export default table
