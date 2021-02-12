import * as React from "react";
import { useTranslation } from "react-i18next";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import { useSignUpFormState } from "./signup-formstate-context";

const useStyles = makeStyles((theme: Theme) => ({
  FormControl: {
    margin: theme.spacing(3),
  },
  FormHelperText: {
    textAlign: "center",
  },
  FormControlLabel: {
    alignItems: "start",
    textAlign: "start",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  Button: {
    marginRight: theme.spacing(1),
  },
}));

export default function SignUpConsent(props: any): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  const { handleBack, handleNext } = props;
  const { state, dispatch } = useSignUpFormState();
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    keyField: string
  ) => {
    dispatch({
      type: "EDIT_FORMVALUE",
      key: keyField,
      value: (event.target as HTMLInputElement).checked,
    });
    setHelperText("");
    setError(false);
  };

  const resetFormState = (): void => {
    setError(false);
    setHelperText("");
  };

  const valideForm = (): boolean => {
    if (state.formValues?.terms && state.formValues?.privacypolicy) {
      return true;
    }

    setError(true);
    setHelperText("you must accept consent");
    return false;
  };

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    resetFormState();
    if (valideForm()) {
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
      <FormControl
        required
        component="fieldset"
        error={error}
        className={classes.FormControl}
      >
        <FormHelperText className={classes.FormHelperText}>
          {t(helperText)}
        </FormHelperText>
        <FormControlLabel
          className={classes.FormControlLabel}
          control={
            <Checkbox
              checked={state.formValues.privacypolicy}
              onChange={(e) => handleChange(e, "privacypolicy")}
              color="default"
              inputProps={{
                "aria-label": "checkbox with default color",
              }}
            />
          }
          label={t(
            `signup-consent-${state.formValues.account_role}-privacy-policy`,
            { privacyPolicy: "Privacy Policy" }
          )}
        />
        <FormControlLabel
          className={classes.FormControlLabel}
          control={
            <Checkbox
              checked={state.formValues.terms}
              onChange={(e) => handleChange(e, "terms")}
              color="default"
              inputProps={{
                "aria-label": "checkbox with default color",
              }}
            />
          }
          label={t(
            `signup-consent-${state.formValues.account_role}-terms-condition`,
            { terms: "Terms or Use" }
          )}
          labelPlacement="end"
        />
        <Button
          variant="contained"
          color="secondary"
          disabled={props.activeStep === 0}
          onClick={handleBack}
          className={classes.Button}
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
