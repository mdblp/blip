import {
  checkPatientProfileSectionCardForAlerts,
  checkPatientProfileSectionCardForInformation,
  checkPatientProfileSectionCardForLeadClinicians,
  checkPatientProfileSectionCardForRange,
  checkPatientProfileSectionsOverviewVisible,
  checkClickViewMoreInformation,
  checkClickViewMoreLeadClinicians,
  checkClickViewMoreRange,
  checkClickViewMoreAlerts
} from '../assert/patient-profile-sections-overview-mobile.assert'

export const testPatientProfileSectionsOverviewVisibleMobile = (): void => {
  checkPatientProfileSectionsOverviewVisible()
  checkPatientProfileSectionCardForInformation()
  checkPatientProfileSectionCardForLeadClinicians()
  checkPatientProfileSectionCardForRange()
  checkPatientProfileSectionCardForAlerts()
}

export const testClickViewMoreInformation = async () => {
  await checkClickViewMoreInformation()
}

export const testClickViewMoreLeadClinicians = async () => {
  await checkClickViewMoreLeadClinicians()
}

export const testClickViewMoreRange = async () => {
  await checkClickViewMoreRange()
}

export const testClickViewMoreAlerts = async () => {
  await checkClickViewMoreAlerts()
}
