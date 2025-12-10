/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React, { type FunctionComponent, useState } from 'react'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import { type ResourceLanguage } from 'i18next'

interface LanguageSelectProps {
  className?: string
}

const styles = makeStyles()((theme) => ({
  select: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.grey[700],
    paddingBlock: 0
  }
}))

const LanguageSelect: FunctionComponent<LanguageSelectProps> = ({ className }) => {
  const { i18n } = useTranslation()
  const [val, setVal] = useState(i18n.language)
  const { classes, cx } = styles()
  const languages = Object.entries(i18n.options.resources).map((languageEntry: [string, ResourceLanguage]) => {
    return { key: languageEntry[0], name: languageEntry[1].name }
  })

  const handleChange = async (event: SelectChangeEvent<unknown>): Promise<void> => {
    const lang = event.target.value as string
    await i18n.changeLanguage(lang)
    setVal(lang)
  }

  return (
    <FormControl variant="standard">
      <Select
        id="language-selector"
        data-testid="language-selector"
        name="language-select"
        disableUnderline
        inputProps={{
          classes: {
            select: cx(classes.select, className)
          }
        }}
        IconComponent={ArrowDropDownIcon}
        value={val}
        onChange={handleChange}
      >
        {languages.map(language => (
          <MenuItem
            id={`language-selector-${language.key}`}
            key={language.key}
            value={language.key}
          >
            {language.name as string}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default LanguageSelect
