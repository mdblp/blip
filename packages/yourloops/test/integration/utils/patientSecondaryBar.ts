import { screen, within } from '@testing-library/react'

export const checkPatientSecondaryBarCommon = () => {
  const secondaryBar = screen.getByTestId('patients-secondary-bar')
  expect(secondaryBar).toBeInTheDocument()
  expect(screen.getByLabelText('Data calculated on the last 7 days')).toHaveTextContent('Data calculated on the last 7 days')
  expect(screen.getByLabelText('Search for a patient')).toBeInTheDocument()
}

export const checkPatientSecondaryBarForHcp = (hasGenerateReportButton = true, hasAddPatientButton = true) => {
  checkPatientSecondaryBarCommon()

  const secondaryBar = screen.getByTestId('patients-secondary-bar')
  expect(within(secondaryBar).getByRole('button')).toBeInTheDocument()

  if (hasGenerateReportButton) {
    expect(within(secondaryBar).getByText('Generate report')).toBeVisible()
  }
  if (hasAddPatientButton) {
    expect(within(secondaryBar).getByText('Add patient')).toBeVisible()
  }
}
