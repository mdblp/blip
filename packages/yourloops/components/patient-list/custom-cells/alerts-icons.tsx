/*
 * Copyright (c) 2026, Diabeloop
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

import React, { ComponentType, ElementType, ReactElement, ReactNode } from 'react';
import { Box, SvgIconProps, Tooltip } from '@mui/material';

export interface AlertIconProps {
  isActive: boolean;
  messages: ReactNode[];
  sharedTooltip: ReactNode;
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void;
  className?: string;
  testId: string;
  Icon: ElementType | ReactElement;
}

export const AlertIcon: React.FC<AlertIconProps> = (props) => {
  const {
    isActive,
    messages,
    sharedTooltip,
    onClick,
    className,
    testId,
    Icon
  } = props

  const commonProps = {
    sx: { cursor: isActive ? 'pointer' : 'default' },
    className,
    color: (isActive ? 'inherit' : 'disabled') as SvgIconProps['color'],
    'data-testid': testId,
    onClick
  }

  const renderIcon = () => {
    const IconComponent = Icon as ComponentType<SvgIconProps>
    return <IconComponent {...commonProps} />
  }

  return (
    <Tooltip
      title={
        <>
          {messages.map((msg, index) => (
            <Box key={index}>{msg}</Box>
          ))}
          {sharedTooltip && <Box>{sharedTooltip}</Box>}
        </>
      }
    >
      {renderIcon()}
    </Tooltip>
  )
}
