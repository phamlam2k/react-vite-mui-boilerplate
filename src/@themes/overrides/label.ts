import type { Theme } from '@mui/material/styles'

const label: Theme['components'] = {
  MuiFormLabel: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(ownerState.color === 'info' && {
          color: 'var(--mui-palette-input-label)'
        }),
        '&.Mui-focused': {
          color: 'var(--mui-palette-primary-main)'
        }
      })
    }
  }
}

export default label
