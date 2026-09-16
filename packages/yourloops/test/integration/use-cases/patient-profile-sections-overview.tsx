import {
  checkPatientProfileSectionCardForAlerts,
  checkPatientProfileSectionCardForInformation,
  checkPatientProfileSectionCardForLeadClinicians,
  checkPatientProfileSectionCardForRange,
  checkPatientProfileSectionsOverviewVisible
} from '../assert/patient-profile-sections-overview-mobile.assert'

export const testPatientProfileSectionsOverviewVisibleMobile = (): void => {
  checkPatientProfileSectionsOverviewVisible()
  checkPatientProfileSectionCardForInformation()
  checkPatientProfileSectionCardForLeadClinicians()
  checkPatientProfileSectionCardForRange()
  checkPatientProfileSectionCardForAlerts()
}
