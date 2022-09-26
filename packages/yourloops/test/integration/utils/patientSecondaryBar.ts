import { screen, within } from '@testing-library/react'

export const checkPatientSecondaryBar = () => {
  const secondaryBar = screen.getByTestId('patients-secondary-bar')
  expect(secondaryBar).toBeInTheDocument()
  expect(screen.getByLabelText('subnav-period-label')).toHaveTextContent('Data calculated on the last 7 days')
  expect(screen.getByLabelText('patient-list-searchbar')).toBeInTheDocument()
  expect(within(secondaryBar).getByRole('button')).toBeInTheDocument()
}
