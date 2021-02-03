/**
 * Copyright (c) 2021, Diabeloop
 * Generic password component file
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

import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import React, { CSSProperties, FunctionComponent, useState } from "react";

import { Visibility } from "@material-ui/icons";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { t } from "../../lib/language";

enum PasswordVisibility {
  text = "text",
  hidden = "password",
}

interface PasswordProps {
  id: string;
  label: string;
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
  helperText: string;
  style?: CSSProperties;
}

export const Password: FunctionComponent<PasswordProps> = ({ id, label, value, error, helperText, style, setState }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setState(event.target.value);
  };

  return (
    <TextField
      id={id}
      value={value}
      error={error}
      type={showPassword ? PasswordVisibility.text : PasswordVisibility.hidden}
      onChange={onChange}
      helperText={error && helperText}
      style={style}
      inputProps={{ style: { textAlign: "right", padding: "1em 2em" } }}
      InputProps={{
        startAdornment: (
          <InputAdornment style={{ color: "black" }} position="start">
            <span>{t(label)}</span>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label={t("aria-toggle-password-visibility")} onClick={handleShowPasswordChange}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
