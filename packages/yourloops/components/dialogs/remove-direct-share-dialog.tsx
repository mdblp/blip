import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { makeButtonsStyles } from '../theme'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import React, { FunctionComponent } from 'react'
import useRemoveDirectShareDialog from './remove-direct-share-dialog.hook'

export interface RemoveDirectShareProps {
  userToRemove: {
    id: string
    email: string
    fullName: string
  }
  onClose: (shouldRefresh: boolean) => void
}

const RemoveDirectShareDialog: FunctionComponent<RemoveDirectShareProps> = ({ onClose, userToRemove }) => {
  const { t } = useTranslation('yourloops')
  const makeButtonsClasses = makeStyles(makeButtonsStyles, { name: 'ylp-dialog-buttons' })
  const buttonsClasses = makeButtonsClasses()
  const { isCurrentUserCaregiver, removeDirectShare } = useRemoveDirectShareDialog({ userToRemove, onClose })

  const titleKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-title' : 'modal-patient-remove-caregiver-title'
  const questionKey = isCurrentUserCaregiver ? 'modal-remove-patient-question' : 'modal-remove-caregiver-question'
  const infoKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-info-2' : 'modal-patient-remove-caregiver-info-2'
  const removeButtonKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-remove' : 'modal-patient-remove-caregiver-remove'

  const closeDialog = (): void => {
    onClose(false)
  }

  return (
    <Dialog
      id="remove-direct-share-dialog"
      open
      aria-labelledby={t(titleKey)}
      onClose={closeDialog}
    >
      <DialogTitle id="remove-direct-share-dialog-title">
        <strong>{t(titleKey)}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t(questionKey, { name: userToRemove.fullName })}
        </DialogContentText>
        <DialogContentText>
          {t(infoKey)}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          id="remove-direct-share-dialog-button-cancel"
          onClick={closeDialog}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="remove-direct-share-dialog-button-remove"
          className={buttonsClasses.alertActionButton}
          variant="contained"
          disableElevation
          onClick={removeDirectShare}
        >
          {t(removeButtonKey)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveDirectShareDialog
