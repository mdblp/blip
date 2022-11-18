/*
 * Copyright (c) 2022, Diabeloop
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

import React from 'react'
import { render, screen } from '@testing-library/react'

import PatientInfo, { PatientInfoProps } from '../../../../components/patient/patient-info'
import { createPatient } from '../../common/utils'
import { genderLabels } from '../../../../lib/auth/helpers'

describe('PatientInfo', () => {
  const patient = createPatient()

  function getPatientInfoJSX(props: PatientInfoProps = { patient }) {
    return <PatientInfo {...props} />
  }

  it('should display correct information', () => {
    render(getPatientInfoJSX())
    expect(screen.getByText('patient')).not.toBeNull()
    expect(screen.getByText(patient.profile.fullName)).not.toBeNull()
    expect(screen.getByText('email')).not.toBeNull()
    expect(screen.getByText(patient.profile.email)).not.toBeNull()
    expect(screen.getByText('gender')).not.toBeNull()
    expect(screen.getByText(genderLabels()[patient.profile.sex])).not.toBeNull()
    expect(screen.getByText('birthdate')).not.toBeNull()
    expect(screen.getByText(patient.profile.birthdate.toDateString())).not.toBeNull()
    expect(screen.getByText('initial-hba1c')).not.toBeNull()
    expect(screen.getByText(patient.settings.a1c?.value)).not.toBeNull()
  })
})
