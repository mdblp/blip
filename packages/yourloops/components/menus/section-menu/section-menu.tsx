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

import CardContent from '@mui/material/CardContent'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { useTheme } from '@mui/material/styles'
import { SectionMenuItem } from './section-menu-item'

interface SectionMenuProps<T extends string> {
  title: string
  sections: SectionMenuState<T>[]
  selectedSection: string
  selectSection: (section: T) => void
  testId: string
}

interface SectionMenuState<T extends string> {
  label: string
  value: T
  testId: string
  icon: React.ReactNode
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  },
  menuItemText: {
    whiteSpace: 'pre-line',
  }
}))

export const SectionMenu = <T extends string>(props: SectionMenuProps<T>) => {
  const { sections, selectedSection, selectSection, title, testId } = props
  const { classes } = useStyles()
  const theme = useTheme()

  return (
    <Card variant="outlined" data-testid={testId}>
      <CardContent>
        <MenuList>
          <Typography className={classes.menuTitle}>{title}</Typography>
          <Divider variant="middle" sx={{
            paddingTop: theme.spacing(1), marginBottom: theme.spacing(2),
          }} />

          {sections.map((section: SectionMenuState<T>) => (
            <SectionMenuItem
              key={section.value}
              label={section.label}
              isSelected={selectedSection === section.value}
              onClick={() => selectSection(section.value)}
              testId={section.testId}
            >
              {section.icon}
            </SectionMenuItem>
          ))
          }
        </MenuList>
      </CardContent>
    </Card>
  )
}
