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

import React, { useState } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import metrics from "../../lib/metrics";
import { FormValuesType, useSignUpFormState } from "./signup-formstate-context";
import { availableCountries } from "../../lib/language";
import SignUpFormProps from "./signup-form-props";
import { HcpProfessionList } from "../../models/hcp-profession";
import { useAuth } from "../../lib/auth";
import { UserRoles } from "../../models/shoreline";
import { useAlert } from "../../components/utils/snackbar";
import ProgressIconButtonWrapper from "../../components/buttons/progress-icon-button-wrapper";

interface Errors {
  firstName: boolean;
  lastName: boolean;
  country: boolean;
  hcpProfession: boolean;
}

const formStyle = makeStyles((theme: Theme) => ({
  backButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 * SignUpProfileForm Form
 */
function SignUpProfileForm(props: SignUpFormProps): JSX.Element {
  const { user, completeSignup } = useAuth();
  const userRole = user?.role as UserRoles;
  const alert = useAlert();
  const { t } = useTranslation("yourloops");
  const { state, dispatch } = useSignUpFormState();
  const { handleBack, handleNext } = props;
  const defaultErr = {
    firstName: false,
    lastName: false,
    country: false,
    hcpProfession: false,
  };
  const [errors, setErrors] = useState<Errors>(defaultErr);
  const [saving, setSaving] = useState<boolean>(false);

  const classes = formStyle();

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    keyField: FormValuesType
  ): void => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: event.target.value,
    });
  };

  const onSelectChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>,
    keyField: FormValuesType
  ): void => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: event.target.value as string,
    });
  };

  const validateFirstName = (): boolean => {
    const err = !state.formValues?.profileFirstname.trim();
    setErrors({ ...errors, firstName: err });
    return !err;
  };

  const validateLastName = (): boolean => {
    const err = !state.formValues?.profileLastname.trim();
    setErrors({ ...errors, lastName: err });
    return !err;
  };

  const validateCountry = (): boolean => {
    const err = !state.formValues?.profileCountry;
    setErrors({ ...errors, country: err });
    return !err;
  };

  const validateHcpProfession = (): boolean => {
    let err = false;
    if (userRole === UserRoles.hcp) {
      err = !state.formValues?.hcpProfession;
      setErrors({ ...errors, hcpProfession: err });
    }
    return !err;
  };

  const onFinishSignup = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (
      validateFirstName() &&
      validateLastName() &&
      validateCountry() &&
      validateHcpProfession()
    ) {
      try {
        setSaving(true);
        await completeSignup(state.formValues);
        metrics.send("registration", "create_profile", userRole);
        handleNext();
      } catch (err) {
        alert.error(t("profile-update-failed"));
        setSaving(false);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <TextField
        id="firstname"
        margin="normal"
        label={t("firstname")}
        variant="outlined"
        value={state.formValues?.profileFirstname}
        required
        error={errors.firstName}
        onBlur={() => validateFirstName()}
        onChange={(e) => onChange(e, "profileFirstname")}
        helperText={errors.firstName && t("required-field")}
      />
      <TextField
        id="lastname"
        margin="normal"
        label={t("lastname")}
        variant="outlined"
        value={state.formValues?.profileLastname}
        required
        error={errors.lastName}
        onBlur={() => validateLastName()}
        onChange={(e) => onChange(e, "profileLastname")}
        helperText={errors.lastName && t("required-field")}
      />
      <FormControl
        variant="outlined"
        margin="normal"
        required
        error={errors.country}
      >
        <InputLabel id="country-selector-input-label">
          {t("signup-country")}
        </InputLabel>
        <Select
          labelId="country-selector-label"
          label={t("signup-country")}
          id="country-selector"
          value={state.formValues?.profileCountry}
          onBlur={() => validateCountry()}
          onChange={(e) => onSelectChange(e, "profileCountry")}
        >
          <MenuItem key="" value="" />
          {availableCountries.map((item) => (
            <MenuItem id={`signup-country-menuitem-${item.code}`} key={item.code} value={item.code}>
              {t(item.name)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {userRole === UserRoles.hcp &&
        <FormControl
          variant="outlined"
          margin="normal"
          required
          error={errors.hcpProfession}
        >
          <InputLabel id="hcp-profession-selector-input-label">
            {t("hcp-profession")}
          </InputLabel>
          <Select
            labelId="hcp-profession-selector-label"
            label={t("hcp-profession")}
            id="hcp-profession-selector"
            value={state.formValues?.hcpProfession}
            onBlur={validateHcpProfession}
            onChange={(e) => onSelectChange(e, "hcpProfession")}
          >
            {HcpProfessionList.map((item) => (
              <MenuItem id={`signup-hcp-profession-menuitem-${item}`} key={item} value={item}>
                {t(item)}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
      }
      <Box
        id="signup-profileform-button-group"
        display="flex"
        justifyContent="end"
        mx={0}
        mt={4}
      >
        <Button
          className={classes.backButton}
          id="button-signup-steppers-back"
          onClick={handleBack}
        >
          {t("signup-steppers-back")}
        </Button>
        <ProgressIconButtonWrapper inProgress={saving}>
          <Button
            id="button-signup-steppers-next"
            variant="contained"
            color="primary"
            disableElevation
            disabled={_.some(errors) || saving}
            onClick={onFinishSignup}
          >
            {t("signup-steppers-create-account")}
          </Button>
        </ProgressIconButtonWrapper>
      </Box>
    </Box>
  );
}

export default SignUpProfileForm;
