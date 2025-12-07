import type { Theme } from '@mui/material/styles'

const text: Theme['components'] = {
  MuiTypography: {
    defaultProps: {
      color: 'text.secondary'
    }
  }
}

export default text
