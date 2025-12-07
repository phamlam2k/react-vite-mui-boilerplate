// MUI Imports
// import { ReactComponent as CollapseIcon } from '~/svgs/collapse-open.svg'

import type { Theme } from '@mui/material/styles'

const iconStyles = (theme: Theme) => ({
  userSelect: 'none',
  display: 'inline-block',
  flexShrink: 0,
  transition: theme.transitions.create('fill', {
    duration: theme.transitions.duration.shorter
  }),
  paddingTop: '0.5px',
  fontSize: '1.25rem',
  position: 'absolute',
  right: '0.85rem',
  pointerEvents: 'none'
})

const select: Theme['components'] = {
  MuiSelect: {
    defaultProps: {
      // IconComponent: () => <CollapseIcon />,
      size: 'medium'
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '&.MuiInputBase-root': {
          height: '2.5rem'
        },
        '& .MuiSelect-select': {
          padding: theme.spacing(1, 1.75)
        }
      }),
      select: ({ theme, ownerState }) => ({
        ...(ownerState.variant === 'outlined' && {
          minHeight: 'var(--mui-shape-height-inputForm)'
        }),
        ...(ownerState.variant === 'filled' && {
          boxShadow: '0px 4px 14px 0px #0000001A',
          borderRadius: 'var(--mui-shape-customBorderRadius-lg)',
          backgroundColor: '#FFFFFF',
          minHeight: 'var(--mui-shape-height-inputForm)'
        }),
        '&[aria-expanded="true"] ~ i, &3[aria-expanded="true"] ~ svg': {
          transform: 'rotate(180deg)'
        },
        '& ~ i, & ~ svg': iconStyles(theme as Theme),
        '&.MuiInputBase-inputSizeSmall': {
          '& ~ i, & ~ svg': {
            height: '1.375rem',
            width: '1.375rem'
          }
        },
        '&:not(aria-label="Without label") ~ .MuiOutlinedInput-notchedOutline > legend > span': {
          paddingInline: '5px'
        }
      })
    }
  },
  MuiNativeSelect: {
    styleOverrides: {
      select: ({ theme }) => ({
        '& + i, & + svg': iconStyles(theme as Theme)
      })
    }
  }
}

export default select
