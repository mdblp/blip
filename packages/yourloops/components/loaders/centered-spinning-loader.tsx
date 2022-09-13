import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

interface CenteredSpinningLoaderProps {
  size?: number
}

const Loader: FunctionComponent<CenteredSpinningLoaderProps> = ({ size }) => {
  return (
    <Box display="flex" justifyContent="center">
      <CircularProgress size={size} />
    </Box>
  )
}

const CenteredSpinningLoader = React.memo(Loader)

export default CenteredSpinningLoader
