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
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";

import brandingLogo from "branding/logo.png";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import DiabeloopUrl from "../../lib/diabeloop-url";

const style = makeStyles((theme: Theme) => {
  return {
    mainContainer: { margin: "auto" },
    Typography: {
      alignItems: "center",
    },
    Card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      // eslint-disable-next-line no-magic-numbers
      padding: theme.spacing(4),
    },
    CardContent: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
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
      marginLeft: "auto !important",
    },
  };
});

/**
 * Patient Renew ConsentPage
 */
function PatientRenewConsentPage(): JSX.Element {
  const { t, i18n } = useTranslation("yourloops");
  const historyHook = useHistory();
  const classes = style();
  const [terms, setTerms] = React.useState(false);
  const [privacyPolicy, setPrivacyPolicy] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const linkTermsText = t("Terms of Use");
  const linkTerms = DiabeloopUrl.getTermsLink(i18n.language);
  const privacyPolicyText = t("Privacy Policy");
  const linkPrivacyPolicy = DiabeloopUrl.getPrivacyPolicyLink(i18n.language);

  const resetFormState = (): void => {
    setError(false);
    setHelperText("");
  };

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setState((event.target as HTMLInputElement).checked);
    resetFormState();
  };

  const valideForm = (): boolean => {
    if (terms && privacyPolicy) {
      return true;
    }

    setError(true);
    setHelperText("required");
    return false;
  };

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    resetFormState();
    if (valideForm()) {
      // api call
      // handleNext();
      historyHook.push("/patient");
    }
  };

  return (
    <Container maxWidth="sm" className={classes.mainContainer}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}>
        <Grid item xs={12}>
          <Card className={classes.Card}>
            <CardMedia
              style={{
                display: "flex",
                paddingTop: "1em",
                paddingBottom: "1em",
              }}>
              <img
                src={brandingLogo}
                style={{
                  height: "60px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                alt={t("Login Branding Logo")}
              />
            </CardMedia>
            <CardContent className={classes.CardContent}>
              <Typography variant="body1" gutterBottom>
                {t("renew-constent-welcome-message")}
              </Typography>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                noValidate
                autoComplete="off">
                <FormControl
                  required
                  component="fieldset"
                  error={error}
                  className={classes.FormControl}>
                  <FormHelperText className={classes.FormHelperText}>
                    {t(helperText)}
                  </FormHelperText>
                  <FormControlLabel
                    className={classes.FormControlLabel}
                    control={
                      <Checkbox
                        checked={privacyPolicy}
                        onChange={(e) => onChange(e, setPrivacyPolicy)}
                        color="default"
                        inputProps={{
                          "aria-label": "checkbox with default color",
                        }}
                      />
                    }
                    label={
                      <Trans
                        t={t}
                        i18nKey="signup-consent-patient-privacy-policy"
                        components={{ linkPrivacyPolicy }}
                        values={{ privacyPolicy: privacyPolicyText }}
                      />
                    }
                  />
                  <FormControlLabel
                    className={classes.FormControlLabel}
                    control={
                      <Checkbox
                        checked={terms}
                        onChange={(e) => onChange(e, setTerms)}
                        color="default"
                        inputProps={{
                          "aria-label": "checkbox with default color",
                        }}
                      />
                    }
                    label={
                      <Trans
                        t={t}
                        i18nKey="signup-consent-patient-terms-condition"
                        components={{ linkTerms }}
                        values={{ terms: linkTermsText }}
                      />
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.Button}
                    onClick={onNext}>
                    {t("confirm")}
                  </Button>
                </FormControl>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientRenewConsentPage;
