import { Reducer } from 'react'
import { SignupForm } from '../../lib/auth'

export type SignupFormKey = keyof SignupForm

export interface SignupReducerAction {
  type: string
  key?: SignupFormKey
  value?: boolean | string
}

const signupFormReducer: Reducer<SignupForm, SignupReducerAction> = (state, action) => {
  switch (action.type) {
    case 'EDIT_FORMVALUE': {
      if (action.value === undefined || action.key === undefined) {
        throw new Error(`Invalid parameter: ${JSON.stringify(action)}`)
      }
      return { ...state, [action.key]: action.value }
    }
  }
}

export default signupFormReducer
