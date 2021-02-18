
import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { SignupReducer, initialState } from "./signup-reducer";

/*
* Signup Form type
*/
export type SignUpFormState = {
  formValues: any,
}

/*
* Create the context for the Signup Form state
*/
const SignUpFormStateContext = createContext<{
  state: SignUpFormState;
  dispatch: Dispatch<any>;
}>({ state: initialState, dispatch: () => null});

/*
* Provide a Signup Form state context
*/
export const SignUpFormStateProvider = ({ children }: any) => {
  // Attach the Signup reducer and assign initial state
  const [state, dispatch] = useReducer(SignupReducer, initialState);
  const value = { state, dispatch };
  return (
    <SignUpFormStateContext.Provider value={value}>
      {children}
    </SignUpFormStateContext.Provider>
  );
};


/**
 Returns the current SignupForm State and a dispatcher to update it
 */
export const useSignUpFormState = () => useContext(SignUpFormStateContext);
