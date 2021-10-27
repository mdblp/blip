import zxcvbn from "zxcvbn";
import _ from "lodash";
import appConfig from "../config";

export function checkPasswordStrength(password: string): { onError: boolean, helperText: string, score: number } {
  let onError = false;
  let helperText = "";
  const { score, feedback } = zxcvbn(password);

  if (_.isEmpty(password.trim()) || password.length < appConfig.PWD_MIN_LENGTH) {
    onError = true;
    helperText = "password-too-short";
  } else if (score < 3) {
    onError = true;
    helperText = feedback.warning ?? "password-too-weak";
  }
  return { onError, helperText, score };
}
