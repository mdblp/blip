/**
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
import { createPatient } from '../../../common/utils'
import MedicalFilesWidget from '../../../../../components/dashboard-widgets/medical-files/medical-files-widget'
import * as authHookMock from '../../../../../lib/auth'
import User from '../../../../../lib/auth/user'
import PatientUtils from '../../../../../lib/patient/utils'
import { PatientTeam } from '../../../../../lib/data/patient'

/* eslint-disable react/display-name */
jest.mock('../../../../../components/dashboard-widgets/medical-files/medical-record-list', () => () => {
  return (<></>)
})
jest.mock('../../../../../components/dashboard-widgets/medical-files/prescription-list', () => () => {
  return (<></>)
})
jest.mock('../../../../../components/dashboard-widgets/medical-files/weekly-report-list', () => () => {
  return (<></>)
})
jest.mock('../../../../../lib/auth')
describe('Medical Files Widget', () => {
  const patient = createPatient('fakePatientId')

  function getMedicalFilesWidgetJSX() {
    return <MedicalFilesWidget patient={patient} />
  }

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } as User }
    })
    jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({} as PatientTeam)
  })

  it('should display widget for the selected monitored team', () => {
    render(getMedicalFilesWidgetJSX())
    expect(screen.getByText('medical-files')).not.toBeNull()
  })
})
