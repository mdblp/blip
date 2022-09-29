import { screen, within } from '@testing-library/react'

export const checkPatientSecondaryBar = () => {
  const secondaryBar = screen.getByTestId('patients-secondary-bar')
  expect(secondaryBar).toBeInTheDocument()
  expect(screen.getByLabelText('Data calculated on the last 7 days')).toHaveTextContent('Data calculated on the last 7 days')
  expect(screen.getByLabelText('Search for a patient')).toBeInTheDocument()
  expect(within(secondaryBar).getByRole('button')).toBeInTheDocument()
}
