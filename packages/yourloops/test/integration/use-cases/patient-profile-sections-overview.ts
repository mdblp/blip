import {
  checkClickViewMoreAlerts,
  checkClickViewMoreInformation,
  checkClickViewMoreLeadClinicians,
  checkClickViewMoreRange,
  checkPatientProfileSectionCardForAlerts,
  checkPatientProfileSectionCardForInformation,
  checkPatientProfileSectionCardForLeadClinicians,
  checkPatientProfileSectionCardForRange,
  checkPatientProfileSectionsOverviewVisibleCommon,
  checkPatientProfileSectionsOverviewVisibleHCP
} from '../assert/patient-profile-sections-overview-mobile.assert'

export const testPatientProfileSectionsOverviewVisibleHCP = (): void => {
  checkPatientProfileSectionsOverviewVisibleHCP()
  checkPatientProfileSectionCardForInformation()
  checkPatientProfileSectionCardForLeadClinicians()
  checkPatientProfileSectionCardForRange()
  checkPatientProfileSectionCardForAlerts()
}

export const testPatientProfileSectionsOverviewVisiblePatient = (): void => {
  checkPatientProfileSectionsOverviewVisibleCommon()
  checkPatientProfileSectionCardForInformation()
  checkPatientProfileSectionCardForLeadClinicians()
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
