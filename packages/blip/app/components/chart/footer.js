/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */
import React from 'react'
import PropTypes from 'prop-types'
import i18next from 'i18next'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function TidelineFooter(props) {
  const { children, onClickRefresh } = props
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight: '10px'
      }}>
      <Box>
        <Button
          data-testid="confirm-dialog-cancel-button"
          variant="outlined"
          onClick={onClickRefresh}
        >
          {i18next.t('Refresh')}
        </Button>
      </Box>
      {children}
    </Box>
  )
}

TidelineFooter.propTypes = {
  children: PropTypes.node,
  onClickRefresh: PropTypes.func.isRequired
}

TidelineFooter.defaultProps = {
  children: null
}

export default TidelineFooter
