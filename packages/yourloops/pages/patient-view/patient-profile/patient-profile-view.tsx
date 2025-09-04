/*
 * Copyright (c) 2023-2024, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { type FC, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { PatientPersonalInformation } from './sections/patient-personal-information'
import { PatientProfileViewMenu } from './patient-profile-view-menu'
import { PatientProfileViewSection } from './patient-profile-view-section.enum'
import { AlertsSection } from './sections/alerts-section'
import { Patient } from '../../../lib/patient/models/patient.model'
import { RangeSection } from './sections/range-section'

interface PatientProfileViewProps {
  patient : Patient
}

export const PatientProfileView: FC<PatientProfileViewProps> = ({ patient }) => {
  const [selectedSection, setSelectedSection] = useState(PatientProfileViewSection.Information)

  const isSelected = (section: PatientProfileViewSection): boolean => {
    return section === selectedSection
  }

  const selectSection = (section: PatientProfileViewSection): void => {
    setSelectedSection(section)
  }

  return (
    <Container data-testid="patient-profile-view-container" maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <PatientProfileViewMenu selectedSection={selectedSection} selectSection={selectSection} />
        </Grid>
        <Grid item xs={9}>
          {
            isSelected(PatientProfileViewSection.Information) ?
              <PatientPersonalInformation patient={patient} />
              : isSelected(PatientProfileViewSection.Range) ?
                <RangeSection
                  patient={patient}
                />
                : isSelected(PatientProfileViewSection.Alerts) ?
                  <AlertsSection
                    patient={patient}
                  /> : <></>
          }

        </Grid>
      </Grid>
    </Container>
  )
}
