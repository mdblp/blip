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

import * as React from "react";
import _ from "lodash";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";

import { useTranslation } from "react-i18next";
import RadioLabel from "./signup-radio-label";
import { useSignUpFormState } from "./signup-formstate-context";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) => ({
  FormControl: {
    margin: theme.spacing(3),
  },
  Button: {
    marginRight: theme.spacing(1),
  },
  Paper: {
    textAlign: "start",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  FormControlLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

/**
 * Sign Up Account Selector
 */
function SignUpAccountSelector(props: any): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  const { state, dispatch } = useSignUpFormState();
  const [error, setError] = React.useState(false);
  const { handleBack, handleNext } = props;
  const [helperText, setHelperText] = React.useState("");

  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    keyField: string
  ) => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: (event.target as HTMLInputElement).value,
    });
    setHelperText("");
    setError(false);
  };

  const resetFormState = (): void => {
    setError(false);
    setHelperText("");
  };

  const valideForm = (): boolean => {
    if (_.isEmpty(state.formValues.account_role)) {
      setError(true);
      setHelperText("you must select a account type");
      return false;
    }
    return true;
  };

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    resetFormState();
    if (valideForm()) {
      handleNext();
    };
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <FormControl
        component="fieldset"
        error={error}
        className={classes.FormControl}
      >
        <FormHelperText>{t(helperText)}</FormHelperText>
        <RadioGroup
          aria-label="account-selector"
          name="account-selector"
          value={state.formValues.account_role}
          onChange={(e) => handleRadioChange(e, "account_role")}
        >
          <Paper elevation={3} className={classes.Paper}>
            <FormControlLabel
              className={classes.FormControlLabel}
              value="hcp"
              control={<Radio />}
              label={
                <RadioLabel
                  header={t("signup-radiolabel-hcp-header")}
                  body={t("signup-radiolabel-hcp-body")}
                />
              }
            />
          </Paper>
          <Paper elevation={3} className={classes.Paper}>
            <FormControlLabel
              className={classes.FormControlLabel}
              value="caregivers"
              control={<Radio />}
              label={
                <RadioLabel
                  header={t("signup-radiolabel-caregiver-header")}
                  body={t("signup-radiolabel-caregiver-body")}
                />
              }
            />
          </Paper>
        </RadioGroup>
        <Button
          variant="contained"
          color="secondary"
          className={classes.Button}
          onClick={handleBack}
        >
          {t("Back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.Button}
          onClick={onNext}
        >
          {t("Next")}
        </Button>
      </FormControl>
    </form>
  );
}

export default SignUpAccountSelector;
