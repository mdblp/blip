import { PatientProfileSectionsOverviewCards } from '../../../components/overview-cards/patient-profile-sections-overview-cards'
import React, { type FC } from 'react'
import { Patient } from '../../../lib/patient/models/patient.model'

interface PatientProfileSectionsOverviewProps {
  patient: Patient
}

export const PatientProfileSectionsOverview: FC<PatientProfileSectionsOverviewProps> = ({ patient }: PatientProfileSectionsOverviewProps) => {

  return (
    <PatientProfileSectionsOverviewCards patient = {patient} />
  )
}
