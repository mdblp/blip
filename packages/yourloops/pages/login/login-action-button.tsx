/*
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { FunctionComponent } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'

interface LoginActionButtonProps {
  caption: string
  className?: string
  onClick: () => void
  title: string
}

const styles = makeStyles({ name: 'login-page-styles' })((theme: Theme) => ({
  button: {
    paddingInline: theme.spacing(3),
    textTransform: 'capitalize'
  },
  caption: {
    position: 'absolute',
    top: -20
  }
}))

const LoginActionButton: FunctionComponent<LoginActionButtonProps> = ({ onClick, className, title, caption }) => {
  const { classes, cx } = styles()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      marginRight={2}
    >
      <Typography
        variant="caption"
        className={classes.caption}
      >
        {caption} ?
      </Typography>
      <Button
        variant="contained"
        size="small"
        disableElevation
        onClick={onClick}
        className={cx(classes.button, className)}
      >
        {title}
      </Button>
    </Box>
  )
}

export default LoginActionButton
