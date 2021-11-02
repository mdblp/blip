import zxcvbn from "zxcvbn";
import _ from "lodash";
import appConfig from "../config";

export interface CheckPasswordStrengthResults {
  onError: boolean;
  helperText: string;
  score: number;
}

export function checkPasswordStrength(password: string): CheckPasswordStrengthResults {
  let onError = false;
  let helperText = "";
  const { score } = zxcvbn(password);

  if (_.isEmpty(password.trim()) || password.length < appConfig.PWD_MIN_LENGTH) {
    onError = true;
    helperText = "password-too-short";
  } else if (score < 3) {
    onError = true;
    helperText = "password-too-weak";
  }
  return { onError, helperText, score };
}
