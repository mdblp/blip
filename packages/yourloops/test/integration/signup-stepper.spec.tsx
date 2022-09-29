import { mockAuth0Hook } from './utils/mockAuth0Hook'
import { AuthContextProvider } from '../../lib/auth'
import { MainLobby } from '../../app/main-lobby'
import { Router } from 'react-router-dom'
import React from 'react'
import { createMemoryHistory } from 'history'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { mockUserApi } from './utils/mockUserApi'
import userEvent from '@testing-library/user-event'

describe('Signup stepper', () => {
  const { updateProfileMock, updatePreferencesMock, updateSettingsMock } = mockUserApi()
  const history = createMemoryHistory({ initialEntries: ['/'] })

  beforeAll(() => {
    mockAuth0Hook(null)
  })

  function getStepperPage(history) {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  async function renderDom() {
    act(() => {
      render(getStepperPage(history))
    })
    await waitFor(() => expect(history.location.pathname).toEqual('/complete-signup'))
  }

  function checkAccountSelectorStep() {
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const caregiverRadioInput = screen.getByLabelText('caregiver-radio-input')
    const hcpRadioInput = screen.getByLabelText('hcp-radio-input')
    const patientRadioInput = screen.getByLabelText('patient-radio-input')

    expect(within(caregiverRadioInput).getByRole('radio')).toBeInTheDocument()
    expect(within(hcpRadioInput).getByRole('radio')).toBeInTheDocument()
    expect(within(patientRadioInput).getByRole('radio')).toBeInTheDocument()
    expect(within(patientRadioInput).getByRole('radio')).toHaveAttribute('disabled')
    expect(within(caregiverRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Caregiver and family')
    expect(within(caregiverRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('View patients diabetes data as an individual caregiver or family member.')
    expect(within(hcpRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Professional')
    expect(within(hcpRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('View all your patients diabetes data in one place. Join and create a care team for your clinic or practice.')
    expect(within(patientRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Patient')
    expect(within(patientRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('If you use a DBL System, you have to create your account from your handset. You can’t create several accounts with the same email address.')

    fireEvent.click(nextButton)
  }

  function checkConsentStep() {
    const privacyCheckbox = within(screen.getByLabelText('privacy-policy-checkbox')).getByRole('checkbox')
    const termsCheckbox = within(screen.getByLabelText('terms-checkbox')).getByRole('checkbox')
    const nextButton = screen.getByRole('button', { name: 'Next' })

    expect(nextButton).toBeDisabled()
    expect(privacyCheckbox).toBeInTheDocument()
    expect(termsCheckbox).toBeInTheDocument()

    fireEvent.click(privacyCheckbox)
    fireEvent.click(termsCheckbox)

    expect(nextButton).not.toBeDisabled()
    fireEvent.click(nextButton)
  }

  async function checkProfileStep() {
    const firstnameInput = within(screen.getByLabelText('First Name')).getByRole('textbox')
    const lastnameInput = within(screen.getByLabelText('Last Name')).getByRole('textbox')
    const countrySelect = screen.getByTestId('country-selector')
    const createButton = screen.getByRole('button', { name: 'Create Account' })

    expect(firstnameInput).toBeInTheDocument()
    expect(lastnameInput).toBeInTheDocument()
    expect(countrySelect).toBeInTheDocument()
    expect(createButton).toBeDisabled()

    await userEvent.type(firstnameInput, 'Lara')
    await userEvent.type(lastnameInput, 'Tatouille')
    fireEvent.mouseDown(within(countrySelect).getByRole('button'))
    screen.getByRole('listbox')
    fireEvent.click(screen.getByRole('option', { name: 'France' }))

    expect(createButton).not.toBeDisabled()
    await act(async () => {
      fireEvent.click(createButton)
    })

    expect(updateProfileMock).toHaveBeenCalled()
    expect(updateSettingsMock).toHaveBeenCalled()
    expect(updatePreferencesMock).toHaveBeenCalled()
  }

  it('should redirect to first step of complete sign-up page when user login for the first time after signup in auth0', async () => {
    await renderDom()
    expect(screen.getByLabelText('signup-stepper')).toBeInTheDocument()
    expect(screen.getByLabelText('step-1-label')).toHaveTextContent('Select account type')
    expect(screen.getByLabelText('step-2-label')).toHaveTextContent('Consent')
    expect(screen.getByLabelText('step-3-label')).toHaveTextContent('Create profile')
  })

  it('should be able to create a caregiver account', async () => {
    await renderDom()
    checkAccountSelectorStep()
    checkConsentStep()
    await checkProfileStep()
  })
})
