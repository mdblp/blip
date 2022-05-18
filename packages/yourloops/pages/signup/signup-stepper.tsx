/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable indent */
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

import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";

import SignUpProfileForm from "./signup-profile-form";
import SignUpConsent from "./signup-consent";
import { useSignUpFormState } from "./signup-formstate-context";
import { useAuth } from "../../lib/auth";

export default function SignUpStepper(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { dispatch } = useSignUpFormState();
  const { logout } = useAuth();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    "signup-steppers-step1",
    "signup-steppers-step2",
  ];

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = async () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      await logout();
    }
  };

  const redirectToHome = () => {
    dispatch({ type: "RESET_FORMVALUES" });
    history.replace("/");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (<SignUpConsent handleBack={handleBack} handleNext={handleNext} />);
      case 1:
        return (<SignUpProfileForm handleBack={handleBack} handleNext={handleNext} />);
      default:
        return t("signup-steppers-step-unknown");
    }
  };

  return (
    <React.Fragment>
      <Box marginX="auto" marginY={3} textAlign="center" maxWidth="60%">
        <Typography variant="h5">
          {t("account-creation-finalization")}
        </Typography>
      </Box>
      <Stepper
        id="signup-stepper"
        activeStep={activeStep}
        alternativeLabel
      >
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
      {activeStep === steps.length ? (
        <Box paddingX={4} paddingY={2} textAlign="left">
          <Typography id="signup-steppers-ending-text-1" variant="h6" gutterBottom>
            {t("account-creation-finalized")}
          </Typography>
          <Typography gutterBottom>
            {t("account-created-info-1")}.
          </Typography>
          <Typography gutterBottom>
            {t("account-created-info-2")}.
          </Typography>
          <Box
            id="signup-consent-button-group"
            display="flex"
            justifyContent="center"
            mx={0}
            mt={4}
          >
            <Button
              id="button-signup-steppers-next"
              variant="contained"
              color="primary"
              disableElevation
              onClick={redirectToHome}
            >
              {t("continue")}
            </Button>
          </Box>
        </Box>
      ) : (
        <div>{getStepContent(activeStep)}</div>
      )}
    </React.Fragment>
  );
}

