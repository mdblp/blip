import React, { FunctionComponent } from 'react'
import { Link as LinkRedirect } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import PersonalInfoForm from './personal-info-form'
import PreferencesForm from './preferences-form'
import ProgressIconButtonWrapper from '../../components/buttons/progress-icon-button-wrapper'
import { useTranslation } from 'react-i18next'
import { useProfilePageState } from './profile-page-context'
import { profileFormCommonClasses } from './css-classes'

export const ProfileForm: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { canSave, saving, saveProfile } = useProfilePageState()
  const classes = profileFormCommonClasses()

  return (
    <React.Fragment>
      <PersonalInfoForm />
      <PreferencesForm />
      <Box display="flex" justifyContent="flex-end" my={3}>
        <LinkRedirect className={classes.cancelLink} to="/">
          <Button
            id="profile-button-cancel"
          >
            {t('button-cancel')}
          </Button>
        </LinkRedirect>
        <ProgressIconButtonWrapper inProgress={saving}>
          <Button
            id="profile-button-save"
            variant="contained"
            disabled={!canSave}
            color="primary"
            disableElevation
            className={classes.button}
            onClick={saveProfile}
          >
            {t('button-save')}
          </Button>
        </ProgressIconButtonWrapper>
      </Box>
    </React.Fragment>
  )
}
