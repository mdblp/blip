import React, { FunctionComponent } from 'react'
import ProgressIconButtonWrapper from '../../components/buttons/progress-icon-button-wrapper'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'

interface SignupStepperActionButtonsProps {
  nextButtonLabel: string
  disabled: boolean
  inProgress?: boolean
  onClickBackButton: () => unknown
  onClickNextButton: () => unknown
}

const SignupStepperActionButtons: FunctionComponent<SignupStepperActionButtonsProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const {
    disabled,
    inProgress = false,
    nextButtonLabel,
    onClickBackButton,
    onClickNextButton
  } = props

  return (
    <Box
      id="signup-profileform-button-group"
      display="flex"
      justifyContent="end"
      mx={0}
      mt={4}
    >
      <Box marginRight={2}>
        <Button
          onClick={onClickBackButton}
        >
          {t('back')}
        </Button>
      </Box>
      <ProgressIconButtonWrapper inProgress={inProgress}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          disabled={disabled}
          onClick={onClickNextButton}
        >
          {nextButtonLabel}
        </Button>
      </ProgressIconButtonWrapper>
    </Box>
  )
}

export default SignupStepperActionButtons
