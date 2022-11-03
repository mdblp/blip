import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { makeButtonsStyles } from '../theme'
import { getUserFirstLastName } from '../../lib/utils'
import { ShareUser } from '../../lib/share/models'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import React from 'react'

export interface RemovePatientAsCaregiverProps {
  actions: RemovePatientAsCaregiverDialogContentProps | null
}

interface RemovePatientAsCaregiverDialogContentProps {
  patient: ShareUser
  onDialogResult: (shouldRemove: boolean) => void
}

const makeButtonsClasses = makeStyles(makeButtonsStyles, { name: 'ylp-dialog-buttons' })

function RemovePatientAsCaregiverDialog(props: RemovePatientAsCaregiverProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const buttonsClasses = makeButtonsClasses()

  const handleClose = (): void => {
    props.actions?.onDialogResult(false)
  }
  const handleRemovePatient = (): void => {
    props.actions?.onDialogResult(true)
  }

  const isDialogOpen = props.actions !== null
  const userName = isDialogOpen ? getUserFirstLastName(props.actions.patient.user) : { firstName: '', lastName: '' }
  const name = t('user-name', userName)

  return (
    <Dialog
      id="caregiver-remove-patient-dialog"
      open={isDialogOpen}
      aria-labelledby={t('modal-caregiver-remove-patient-title')}
      onClose={handleClose}
    >
      <DialogTitle id="caregiver-remove-patient-dialog-title">
        <strong>{t('modal-caregiver-remove-patient-title')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t('modal-remove-patient-question', { name })}
        </DialogContentText>
        <DialogContentText>
          {t('modal-caregiver-remove-patient-info-2')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          id="caregiver-remove-patient-dialog-button-cancel"
          onClick={handleClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="caregiver-remove-patient-dialog-button-remove"
          className={buttonsClasses.alertActionButton}
          variant="contained"
          disableElevation
          onClick={handleRemovePatient}
        >
          {t('modal-caregiver-remove-patient-remove')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemovePatientAsCaregiverDialog
