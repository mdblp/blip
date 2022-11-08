import { screen, within } from '@testing-library/react'

export const checkPatientSecondaryBar = (hasGenerateReportButton = true, hasAddPatientButton = true) => {
  const secondaryBar = screen.getByTestId('patients-secondary-bar')
  expect(secondaryBar).toBeInTheDocument()
  expect(screen.getByLabelText('Data calculated on the last 7 days')).toHaveTextContent('Data calculated on the last 7 days')
  expect(screen.getByLabelText('Search for a patient')).toBeInTheDocument()
  if (hasGenerateReportButton) {
    expect(within(secondaryBar).getByText('Generate report')).toBeVisible()
  }
  if (hasAddPatientButton) {
    expect(within(secondaryBar).getByText('Add patient')).toBeVisible()
  }
}
