/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

interface IconActionButtonProps {
  ['data-action']?: string
  ['aria-label']?: string
  ['data-testid']?: string
  className?: string
  color?: 'inherit' | 'primary' | 'secondary' | 'default'
  component?: React.ElementType
  icon: JSX.Element
  id?: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  size?: 'small' | 'medium'
  tooltip?: string
  disabled?: boolean
}

const IconActionButton: FunctionComponent<IconActionButtonProps> = (props) => {
  const { id, onClick, className, size, icon, disabled } = props
  const color = props.color
  const tooltip = props.tooltip ?? ''

  return (
    <Tooltip title={tooltip} aria-label={tooltip}>
      <IconButton
        id={id}
        size={size}
        color={color}
        onClick={onClick}
        aria-label={props['aria-label']}
        data-testid={props['data-testid']}
        data-action={props['data-action']}
        className={className}
        disabled={disabled}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}

export default IconActionButton
