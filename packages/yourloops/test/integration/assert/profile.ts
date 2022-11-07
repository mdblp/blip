import { screen } from '@testing-library/react'

interface CommonFieldsHtmlElements {
  firstNameInput: HTMLElement
  lastNameInput: HTMLElement
  unitsSelect: HTMLElement
  languageSelect: HTMLElement
}

interface PatientFieldsHtmlElements extends CommonFieldsHtmlElements {
  birthdayInput: HTMLElement
  birthPlaceInput: HTMLElement
  genderSelect: HTMLElement
  referringDoctorInput: HTMLElement
  birthFirstNameInput?: HTMLElement
  birthLastNameInput?: HTMLElement
  birthNamesInput?: HTMLElement
  birthPlaceZipcodeInput?: HTMLElement
  insInput?: HTMLElement
  ssnInput?: HTMLElement
  oidInput?: HTMLElement
}

const checkCommonFields = (): CommonFieldsHtmlElements => {
  const firstNameInput = screen.getByLabelText('First Name')
  const lastNameInput = screen.getByLabelText('Last Name')
  const unitsSelect = screen.getByTestId('profile-units-selector')
  const languageSelect = screen.getByTestId('profile-local-selector')

  expect(firstNameInput).toBeInTheDocument()
  expect(lastNameInput).toBeInTheDocument()
  expect(unitsSelect).toBeInTheDocument()
  expect(lastNameInput).toBeInTheDocument()

  return {
    firstNameInput,
    lastNameInput,
    unitsSelect,
    languageSelect
  }
}

export const checkPatientProfilePage = (patientCountry: string): PatientFieldsHtmlElements => {
  const birthdayInput = screen.getByLabelText('Date of birth')
  const birthPlaceInput = screen.getByLabelText('Birth place')
  const genderSelect = screen.getByLabelText('Gender')
  const referringDoctorInput = screen.getByLabelText('Gender')
  const birthFirstNameInput = screen.queryByLabelText('Birth first name')
  const birthLastNameInput = screen.queryByLabelText('Birth last name')
  const birthNamesInput = screen.queryByLabelText('Birth name(s)')
  const birthPlaceZipcodeInput = screen.queryByLabelText('Birth place INSEE zipcode')
  const insInput = screen.queryByLabelText('INS')
  const ssnInput = screen.queryByLabelText('SSN')
  const oidInput = screen.queryByLabelText('OID')
  const inputs = {
    ...checkCommonFields(),
    birthdayInput,
    birthPlaceInput,
    genderSelect,
    referringDoctorInput
  }

  expect(inputs.unitsSelect).toHaveClass('Mui-disabled')
  expect(birthdayInput).toBeInTheDocument()
  expect(birthPlaceInput).toBeInTheDocument()
  expect(genderSelect).toBeInTheDocument()
  expect(referringDoctorInput).toBeInTheDocument()

  if (patientCountry === 'FR') {
    expect(birthFirstNameInput).toBeInTheDocument()
    expect(birthLastNameInput).toBeInTheDocument()
    expect(birthNamesInput).toBeInTheDocument()
    expect(birthPlaceZipcodeInput).toBeInTheDocument()
    expect(insInput).toBeInTheDocument()
    expect(ssnInput).toBeInTheDocument()
    expect(oidInput).toBeInTheDocument()

    return {
      ...inputs,
      birthFirstNameInput,
      birthLastNameInput,
      birthNamesInput,
      birthPlaceZipcodeInput,
      insInput,
      ssnInput,
      oidInput
    }
  }
  expect(birthFirstNameInput).not.toBeInTheDocument()
  expect(birthLastNameInput).not.toBeInTheDocument()
  expect(birthNamesInput).not.toBeInTheDocument()
  expect(birthPlaceZipcodeInput).not.toBeInTheDocument()
  expect(insInput).not.toBeInTheDocument()
  expect(ssnInput).not.toBeInTheDocument()
  expect(oidInput).not.toBeInTheDocument()

  return inputs
}
