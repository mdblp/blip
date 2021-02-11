import * as React from "react";
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
import { SignUpFormStateProvider } from "./signup-formstate-context";

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
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      console.log("return to login");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
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
          <SignUpConsent
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <SignUpProfileForm
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <SignUpAccountForm
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div className={classes.root}>
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
              Ending message ?????
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Go back to login
            </Button>
          </div>
        ) : (
          <div>
            <SignUpFormStateProvider>
              {getStepContent(activeStep)}
            </SignUpFormStateProvider>
          </div>
        )}
      </div>
    </div>
  );
}
