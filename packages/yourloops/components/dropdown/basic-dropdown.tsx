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

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";

export interface BasicDropdownProps {
  id: string;
  defaultValue: string;
  values: string[];
  onSelect: (value: string) => void;
}

const styles = makeStyles((theme: Theme) => ({
  select: {
    "backgroundColor": theme.palette.grey[100],
    "height": "40px",
    "maxWidth": "200px",
    "borderRadius": "8px",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
}));

function BasicDropdown(props: BasicDropdownProps): JSX.Element {
  const { onSelect, defaultValue, values, id } = props;
  const { t } = useTranslation("yourloops");
  const classes = styles();
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <Select
      id={`basic-dropdown-${id}-selector`}
      value={selectedValue}
      className={classes.select}
      variant="outlined"
      input={<OutlinedInput margin="dense" />}
      onChange={handleSelectChange}>
      {values.map(item => (
        <MenuItem id={`basic-dropdown-${id}-menuitem-${item}`} key={item} value={item}>
          {t(item)}
        </MenuItem>
      ))}
    </Select>
  );
}

export default BasicDropdown;
