import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { errorTextFromException, REGEX_EMAIL } from "../../lib/utils";
import { checkPasswordStrength } from "../../lib/auth/helpers";
import { useAuth } from "../../lib/auth";
import { useAlert } from "../../components/utils/snackbar";
import { PasswordStrengthMeter } from "../../components/utils/password-strength-meter";
import Password from "../../components/utils/password";
import RequestPasswordMessage from "./request-password-message";

interface Errors {
  username: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;
}

const formStyle = makeStyles((theme: Theme) => {
  return {
    CardContent: {
      textAlign: "start",
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    CardActions: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      padding: theme.spacing(2),
      justifyContent: "flex-end",
    },
    TextField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(1),
    },
  };
});

export default function ResetPasswordContent(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = formStyle();
  const auth = useAuth();
  const history = useHistory();
  const alert = useAlert();

  const [username, setUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);
  const [usernameTextFieldFocused, setUsernameTextFieldFocused] = React.useState(false);

  const passwordCheck = checkPasswordStrength(newPassword);
  const resetKey = React.useMemo(() => new URLSearchParams(location.search).get("resetKey"), []);
  const errors: Errors = React.useMemo(
    () => ({
      username: _.isEmpty(username.trim()) || !REGEX_EMAIL.test(username),
      newPassword: passwordCheck.onError,
      confirmNewPassword: _.isEmpty(confirmNewPassword.trim()) || confirmNewPassword !== newPassword,
      resetKey: !resetKey,
    }), [confirmNewPassword, newPassword, passwordCheck.onError, resetKey, username]
  );

  const onSendResetPassword = async (): Promise<void> => {
    if (!errors.username && !errors.newPassword && !errors.confirmNewPassword && resetKey) {
      try {
        await setInProgress(true);
        const success = await auth.resetPassword(
          resetKey,
          username,
          confirmNewPassword
        );
        setSuccess(success);
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        alert.error(t(errorMessage));
      } finally {
        setInProgress(false);
      }
    }
  };

  return (
    <React.Fragment>
      {success ? (
        <RequestPasswordMessage
          header="password-reset-success-title"
          body="password-reset-success"
        />
      ) : (
        <>
          <CardContent className={classes.CardContent}>
            <Typography variant="h6" gutterBottom>
              {t("password-reset-title")}
            </Typography>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              noValidate
              autoComplete="off"
            >
              {_.isEmpty(resetKey) ? <Typography>{t("reset-key-is-missing")}</Typography> : null}
              <TextField
                id="username"
                margin="normal"
                label={t("email")}
                variant="outlined"
                value={username}
                required
                error={errors.username && username.length > 0 && !usernameTextFieldFocused}
                onBlur={() => setUsernameTextFieldFocused(false)}
                onFocus={() => setUsernameTextFieldFocused(true)}
                onChange={(e) => setUsername(e.target.value)}
                helperText={errors.username && username.length > 0 && !usernameTextFieldFocused && t("invalid-email")}
              />
              <Password
                id="password"
                label={t("new-password")}
                autoComplete="new-password"
                variant="outlined"
                value={newPassword}
                error={errors.newPassword && newPassword.length > 0}
                checkStrength
                required
                helperText={
                  newPassword.length > 0 &&
                  <PasswordStrengthMeter
                    force={passwordCheck.score}
                    error={errors.newPassword}
                    helperText={passwordCheck.helperText}
                  />
                }
                onChange={(password) => setNewPassword(password)}
              />
              <Password
                id="confirm-password"
                label={t("confirm-new-password")}
                value={confirmNewPassword}
                error={errors.confirmNewPassword && confirmNewPassword.length > 0}
                helperText={errors.confirmNewPassword && t("password-dont-match")}
                autoComplete="new-password"
                variant="outlined"
                margin="normal"
                required
                onChange={(password) => setConfirmNewPassword(password)}
              />
            </form>
          </CardContent>
          <CardActions className={classes.CardActions}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => history.push("/")}
            >
              {t("button-cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onSendResetPassword}
              disabled={_.some(errors) || inProgress}
            >
              {inProgress ? t("button-saving") : t("button-save")}
            </Button>
          </CardActions>
        </>
      )}
    </React.Fragment>
  );
}
