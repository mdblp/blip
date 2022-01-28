/**
 * Copyright (c) 2022, Diabeloop
 * Switch role from caregiver to HCP dialog - Accept terms
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

import React from "react";
import { useTranslation } from "react-i18next";

import { FormControl, FormGroup, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type SelectChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;
type HandleChange<E> = (event: E) => void;

export interface Errors {
  notAllowedValue: boolean;
}

export interface BasicDropdownProps<T> {
  onSelect: (value: T) => void;
  defaultValue: string;
  disabledValues: string[];
  values: string[];
  translationKey: string;
}

const dialogStyles = makeStyles(
  () => {
    return {
      formControl: {
        display: "flex",
      },
    };
  },
);

function BasicDropdown<T>(props: BasicDropdownProps<T>): JSX.Element {
  const { onSelect, defaultValue, disabledValues, values, translationKey } = props;
  const classes = dialogStyles();
  const { t } = useTranslation("yourloops");

  const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);
  const createHandleSelectChange = <K extends string>(setState: SetState<K>): HandleChange<SelectChangeEvent> => (event) => {
    setState(event.target.value as K);
    onSelect(event.target.value as T);
  };
  const errors: Errors = React.useMemo(
    () => ({
      notAllowedValue: disabledValues.includes(selectedValue),
    }),
    [selectedValue, disabledValues]
  );

  return (
    <FormControl id={"dropdown-form"} className={classes.formControl}>
      <FormGroup>
        <InputLabel id={`dropdown-${translationKey}-input-label`}>{t(`dropdown-input-${translationKey}`)}</InputLabel>
        <Select
          name={`dropdown-${translationKey}`}
          labelId="locale-selector"
          id={`dropdown-${translationKey}-selector`}
          value={selectedValue}
          error={errors.notAllowedValue}
          onChange={createHandleSelectChange(setSelectedValue)}>
          {values.map(item => (
            <MenuItem id={`dropdown-${translationKey}-menuitem-${item}`} key={item} value={item}>
              {t(item)}
            </MenuItem>
          ))}
        </Select>
        {errors.notAllowedValue &&
          <FormHelperText error>{t(`dropdown-error-${translationKey}`)}</FormHelperText>
        }
      </FormGroup>
    </FormControl>
  );
}

export default BasicDropdown;
