/**
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

import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import diabeloopUrls from "../../lib/diabeloop-url";
import { UserRoles } from "../../models/shoreline";
import User from "../../lib/auth/user";

const documentSelectStyle = makeStyles((theme: Theme) => {
  return {
    select: {
      fontSize: "12px",
      color: theme.palette.grey[600],
    },
  };
});

export interface DocumentSelectProps {
  user?: User,
}

export const ACCOMPANYING_DOCUMENTS = "accompanying-documents";
export const INTENDED_USE = "intended-use";
export const TRAINING = "training";

function DocumentSelect(props: DocumentSelectProps): JSX.Element {
  const { user } = props;
  const { t, i18n } = useTranslation("yourloops");
  const classes = documentSelectStyle();
  const selectedValue = t(ACCOMPANYING_DOCUMENTS);
  const intendedUse = t(INTENDED_USE);
  const training = t(TRAINING);

  const values = [selectedValue, intendedUse, training];

  const getUrl = (documentName: string) => {
    switch (documentName) {
    case intendedUse:
      return diabeloopUrls.getIntendedUseUrL(i18n.language);
    case training:
      if (!user) {
        return diabeloopUrls.getLoginTrainingUrL(i18n.language);
      } else if (user.role === UserRoles.patient) {
        return diabeloopUrls.getPatientTrainingUrL(i18n.language);
      } else if (user.role === UserRoles.hcp) {
        return diabeloopUrls.getHcpTrainingUrL(i18n.language);
      } else if (user.role === UserRoles.caregiver) {
        return diabeloopUrls.getCaregiverTrainingUrL(i18n.language);
      }
      throw Error(`Could not find training for role ${user.role}`);
    default:
      return null;
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    const url = getUrl(selectedValue);
    if (url) {
      window.open(url);
    }
  };

  return (
    <Select
      id="document-selector"
      disableUnderline
      value={selectedValue}
      inputProps={{
        classes: {
          select: classes.select,
        },
      }}
      IconComponent={ArrowDropDownIcon}
      onChange={handleChange}
    >
      {values.map(item => (
        <MenuItem id={`document-select-menuitem-${item}`} disabled={item === selectedValue} key={item} value={item}>
          {t(item)}
        </MenuItem>
      ))}
    </Select>
  );
}

export default DocumentSelect;
