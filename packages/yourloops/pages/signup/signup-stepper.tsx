import * as React from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import SignUpAccountForm from "./signup-account-form";
import SignUpAccountSelector from "./signup-account-selector";
import SignUpProfileForm from "./signup-profile-form";
import SignUpConsent from "./signup-consent";
import { useSignUpFormState } from "./signup-formstate-context";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

function getSteps() {
  return [
    "signup-steppers-step1",
    "signup-steppers-step2",
    "signup-steppers-step3",
    "signup-steppers-step4",
  ];
}

export default function SignUpStepper() {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  const { state, dispatch } = useSignUpFormState();
  let history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  const [tittle, setTitle] = React.useState("");
  const steps = getSteps();

  React.useEffect(() => {
    if (!_.isEmpty(state.formValues?.account_role)) {
      setTitle(`signup-steppers-${state.formValues.account_role}-title`);
    }
  }, [state.formValues.account_role]);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      history.push("/");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleLogin = () => {
    dispatch({ type: "RESET_FORMVALUES" });
    history.push("/");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SignUpAccountSelector
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <SignUpConsent handleBack={handleBack} handleNext={handleNext} />
        );
      case 2:
        return (
          <SignUpProfileForm handleBack={handleBack} handleNext={handleNext} />
        );
      case 3:
        return (
          <SignUpAccountForm handleBack={handleBack} handleNext={handleNext} />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className={classes.root}>
      {activeStep > 0 && (
        <Typography color="primary" variant="h4" gutterBottom>
          {t(tittle)}
        </Typography>
      )}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{t(label)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              {t("signup-steppers-ending-message", {
                email: state.formValues.account_username,
              })}
            </Typography>
            <Button onClick={handleLogin} className={classes.button}>
              {t("signup-steppers-back-login")}
            </Button>
          </div>
        ) : (
          <div>{getStepContent(activeStep)}</div>
        )}
      </div>
    </div>
  );
}
