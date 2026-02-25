import styledComponent from '@emotion/styled'
import { styled, Tooltip } from '@mui/material'

export const OptionSelectAllStyled = styledComponent.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  gap: 10px;
`

export const OpitonListContainerStyled = styledComponent.div`
  flex: 1;
  overflow-x: hidden;
`

export const TootipChipSelectStyled = styled(Tooltip)({
  maxWidth: '100px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

export const OptionsEmptyStyled = styledComponent.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

export const LoadingContainerStyled = styledComponent.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`
