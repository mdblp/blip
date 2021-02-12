import _ from "lodash";
import { SignUpFormState } from "./signup-formstate-context";

export const initialState: SignUpFormState = {
  formValues: {
    account_username: "",
    account_password: "",
    account_role: "",
    profile_firstname: "",
    profile_lastname: "",
    profile_country: null,
    profile_phone: "",
    terms: false,
    privacypolicy: false,
  },
};

export function SignupReducer(state: any, action: any) {
  switch (action.type) {
    case "EDIT_FORMVALUE":
      state.formValues[action.key.toLowerCase()] = action.value;
      return { ...state };
    case "RESET_FORMVALUES":
      return {
        ...state,
        formValues: initialState.formValues,
      };
    default:
  }
  return state;
}
