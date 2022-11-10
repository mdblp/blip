import { useTranslation } from 'react-i18next'
import { useAlert } from '../utils/snackbar'
import { INotification } from '../../lib/notifications/models'
import DirectShareApi from '../../lib/share/direct-share-api'
import { useAuth } from '../../lib/auth'
import { useNotification } from '../../lib/notifications/hook'

interface RemoveDirectShareDialogHookProps {
  userToRemove: {
    id: string
    email: string
    fullName: string
  }
  onClose: (shouldRefresh: boolean) => void
}

interface RemoveDirectShareDialogHookReturn {
  isCurrentUserCaregiver: boolean
  removeDirectShare: () => Promise<void>
}

const useRemoveDirectShareDialog = ({ userToRemove, onClose }: RemoveDirectShareDialogHookProps): RemoveDirectShareDialogHookReturn => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const currentUser = useAuth().user
  const isCurrentUserCaregiver = currentUser.isUserCaregiver()
  const notificationHook = useNotification()
  const { sentInvitations } = notificationHook

  const removeDirectShare = async (): Promise<void> => {
    try {
      const patientId = isCurrentUserCaregiver ? userToRemove.id : currentUser.id
      const viewerId = isCurrentUserCaregiver ? currentUser.id : userToRemove.id
      const invitation = sentInvitations.find((invitation: INotification) => invitation.email === userToRemove.email)

      if (invitation) {
        await notificationHook.cancel(invitation)
      } else {
        await DirectShareApi.removeDirectShare(patientId, viewerId)
      }

      const successAlertKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-success' : 'modal-patient-remove-caregiver-success'
      alert.success(t(successAlertKey))

      const shouldRefresh = !invitation
      onClose(shouldRefresh)
    } catch (reason) {
      const errorAlertKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-failure' : 'modal-patient-remove-caregiver-failure'
      alert.error(t(errorAlertKey))
    }
  }

  return { isCurrentUserCaregiver, removeDirectShare }
}

export default useRemoveDirectShareDialog
