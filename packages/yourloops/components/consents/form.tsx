/**
 * Copyright (c) 2021, Diabeloop
 * Consents common form
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

import { Theme, makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Link from "@material-ui/core/Link";

import { UserRoles } from "../../models/shoreline";
import diabeloopUrl from "../../lib/diabeloop-url";
import { ConsentFormProps } from "./models";

const formStyles = makeStyles(
  (theme: Theme) => {
    return {
      formControlLabel: {
        color: theme.palette.text.primary,
        textAlign: "start",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
      checkbox: {
        marginBottom: "auto",
      },
    };
  },
  { name: "ylp-form-consents" }
);

function ConsentForm(props: ConsentFormProps): JSX.Element {
  const {
    userRole,
    id,
    className,
    policyAccepted,
    setPolicyAccepted,
    termsAccepted,
    setTermsAccepted,
    feedbackAccepted,
    setFeedbackAccepted,
  } = props;
  const { t, i18n } = useTranslation("yourloops");
  const classes = formStyles();

  const showFeedback = typeof setFeedbackAccepted === "function" && userRole === UserRoles.hcp;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const what = event.target.name;
    switch (what) {
    case "policy":
      setPolicyAccepted(!policyAccepted);
      break;
    case "terms":
      setTermsAccepted(!termsAccepted);
      break;
    case "feedback":
      if (typeof setFeedbackAccepted === "function") {
        setFeedbackAccepted(!feedbackAccepted);
      }
      break;
    default:
      throw new Error("Invalid change type");
    }
  };

  const checkboxPolicy = (
    <Checkbox
      id={`${id}-checkbox-policy`}
      className={classes.checkbox}
      checked={policyAccepted}
      onChange={handleChange}
      name="policy"
      color="primary"
    />
  );
  const privacyPolicy = t("privacy-policy");
  const linkPrivacyPolicy = (
    <Link aria-label={privacyPolicy} href={diabeloopUrl.getPrivacyPolicyUrL(i18n.language)} target="_blank" rel="noreferrer">
      {privacyPolicy}
    </Link>
  );
  const labelPrivacyPolicy = (
    <Trans
      i18nKey={`signup-consent-${userRole}-privacy-policy`}
      t={t}
      components={{ linkPrivacyPolicy }}
      values={{ privacyPolicy }}
      parent={React.Fragment}>
      I have read and accepted YourLoops {privacyPolicy}.
    </Trans>
  );

  const checkboxTerms = (
    <Checkbox
      id={`${id}-checkbox-terms`}
      className={classes.checkbox}
      checked={termsAccepted}
      onChange={handleChange}
      name="terms"
      color="primary"
    />
  );
  const terms = t("terms-of-use");
  const linkTerms = (
    <Link aria-label={terms} href={diabeloopUrl.getTermsUrL(i18n.language)} target="_blank" rel="noreferrer">
      {terms}
    </Link>
  );
  const labelTerms = (
    <Trans
      i18nKey={`signup-consent-${userRole}-terms-condition`}
      t={t}
      components={{ linkTerms }}
      values={{ terms }}
      parent={React.Fragment}>
      I have read and accepted YourLoops {terms}.
    </Trans>
  );

  let formControlFeedback: JSX.Element | null = null;
  if (showFeedback) {
    const checkboxFeedback = (
      <Checkbox
        id={`${id}-checkbox-feedback`}
        className={classes.checkbox}
        checked={feedbackAccepted}
        onChange={handleChange}
        name="feedback"
        color="primary"
      />
    );
    const labelFeedback = t(`consent-${userRole}-feedback`);
    formControlFeedback = (
      <FormControlLabel
        id={`${id}-label-feedback`}
        control={checkboxFeedback}
        label={labelFeedback}
        className={classes.formControlLabel}
      />
    );
  }

  return (
    <FormControl id={`${id}-form`} className={className}>
      <FormGroup>
        <FormControlLabel
          id={`${id}-label-policy`}
          control={checkboxPolicy}
          label={labelPrivacyPolicy}
          className={classes.formControlLabel}
        />
        <FormControlLabel
          id={`${id}-label-terms`}
          control={checkboxTerms}
          label={labelTerms}
          className={classes.formControlLabel}
        />
        {formControlFeedback}
      </FormGroup>
    </FormControl>
  );
}

export default ConsentForm;
