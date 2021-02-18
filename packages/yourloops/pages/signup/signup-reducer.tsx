import _ from "lodash";
import { SignUpFormState } from "./signup-formstate-context";

export const initialState: SignUpFormState = {
  formValues: {
    accountUsername: "",
    accountPassword: "",
    accountRole: "",
    profileFirstname: "",
    profileLastname: "",
    profileCountry: "", // how to do better ?
    profilePhone: "",
    profileJob: "",
    terms: false,
    privacyPolicy: false,
  },
};

export function SignupReducer(state: any, action: any) {
  let clone = null;
  switch (action.type) {
    case "EDIT_FORMVALUE":
      // clone input state in order to avoid initialstate mutation
      clone = _.cloneDeep(state);
      clone.formValues[action.key] = action.value;
      return clone;
    case "RESET_FORMVALUES":
      return initialState;
    default:
  }
  return state;
}
