// MUI Imports
import type { Theme } from '@mui/material/styles'

const appbar: Theme['components'] = {
  MuiAppBar: {
    styleOverrides: {
      root: {
        position: 'relative',
        backgroundColor: 'var(--mui-palette-common-white)',
        boxShadow: 'none',
        minHeight: '60px',
        width: '100%',

        '&.MuiAppBar-positionFixed': {
          borderBottom: '1px solid var(--mui-palette-secondary-lighterOpacity)'
        },

        '& .MuiToolbar-root': {
          width: '100%',
          height: '100%',
          padding: '0 16px',
          '@media (min-width: 600px)': {
            padding: '0 24px'
          }
        }
      }
    }
  }
}

export default appbar
