/* eslint-disable no-unused-vars */
/**
 * Copyright (c) 2021, Diabeloop
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

import _ from "lodash";
import * as React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSignUpFormState } from "./signup-formstate-context";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { availableCountries } from "../../lib/language";

const formStyle = makeStyles((theme: Theme) => {
  return {
    Button: {
      marginRight: theme.spacing(1),
    },
    TextField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(1),
    },
    Checkbox: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  };
});

/**
 * SignUpProfileForm Form
 */
function SignUpProfileForm(props: any): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { state, dispatch } = useSignUpFormState();
  const { handleBack, handleNext } = props;
  const defaultErr = {
    firstname: false,
    lastname: false,
    phone: false,
  };
  const [errors, setErrors] = useState(defaultErr);
  const [firstnameHelperTextValue, setfirstnameHelperTextValue] = useState("");
  const [
    lastnameChangeHelperTextValue,
    setlastnameChangeHelperTextValue,
  ] = useState("");
  const [phoneChangeHelperTextValue, setphoneChangeHelperTextValue] = useState(
    ""
  );
  const classes = formStyle();

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    keyField: string
  ): void => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: event.target.value,
    });
  };

  const onCountryChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>,
    keyField: string
  ): void => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: event.target.value as string,
    });
  };

  const resetFormState = (): void => {
    setErrors(defaultErr);
    setfirstnameHelperTextValue("");
    setlastnameChangeHelperTextValue("");
    setphoneChangeHelperTextValue("");
  };

  const validateForm = (): boolean => {
    let errorSeen = false;
    let firstname = false;
    let lastName = false;
    //let phone = false;
    //let country = false;

    // for now duplicated blip validation logic
    // Is there a better way to handle errors...
    if (_.isEmpty(state.formValues.profile_firstname)) {
      firstname = true;
      errorSeen = true;
    }

    const IS_REQUIRED = t("This field is required.");

    if (!state.formValues.profile_firstname) {
      setfirstnameHelperTextValue(IS_REQUIRED);
      firstname = true;
      errorSeen = true;
    }

    if (_.isEmpty(state.formValues.profile_lastname)) {
      lastName = true;
      errorSeen = true;
    }

    if (!state.formValues.profile_lastname) {
      setlastnameChangeHelperTextValue(IS_REQUIRED);
      lastName = true;
      errorSeen = true;
    }

    setErrors({ firstname: firstname, lastname: lastName, phone: false });
    return !errorSeen;
  };

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    resetFormState();
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="firstname"
        className={classes.TextField}
        margin="normal"
        label={t("firstname")}
        variant="outlined"
        value={state.formValues.profile_firstname}
        required
        error={errors.firstname}
        onChange={(e) => onChange(e, "profile_firstname")}
        helperText={firstnameHelperTextValue}
      />
      <TextField
        id="lastname"
        className={classes.TextField}
        margin="normal"
        label={t("lastname")}
        variant="outlined"
        value={state.formValues.profile_lastname}
        required
        error={errors.lastname}
        onChange={(e) => onChange(e, "profile_lastname")}
        helperText={lastnameChangeHelperTextValue}
      />
      <TextField
        id="phone"
        className={classes.TextField}
        margin="normal"
        label={t("phone")}
        variant="outlined"
        value={state.formValues.profile_phone}
        required
        error={errors.phone}
        onChange={(e) => onChange(e, "profile_phone")}
        helperText={phoneChangeHelperTextValue}
      />
      <FormControl
        variant="outlined"
        className={classes.TextField}
        margin="normal"
      >
        <InputLabel id="country-selector-input-label">
          {t("country")}
        </InputLabel>
        <Select
          labelId="country-selector-label"
          label={t("country")}
          id="country-selector"
          value={state.formValues.profile_country}
          onChange={(e) => onCountryChange(e, "profile_country")}
        >
          <MenuItem key="" value="" />
          {availableCountries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="secondary"
        className={classes.Button}
        onClick={handleBack}
      >
        {t("signup-steppers-back")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.Button}
        onClick={onNext}
      >
        {t("signup-steppers-next")}
      </Button>
    </form>
  );
}

export default SignUpProfileForm;
