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
import { fireEvent, render, screen } from '@testing-library/react'
import WeeklyReportDialog from '../../../../components/dialogs/weekly-report-dialog'
import { WeeklyReport } from '../../../../lib/medical-files/model'
import * as teamHookMock from '../../../../lib/team'
import { createPatient, createPatientTeam } from '../../../common/utils'
import { UserInvitationStatus } from '../../../../models/generic'
import { UNITS_TYPE } from '../../../../lib/units/utils'
import { Alarm } from '../../../../models/alarm'
import { formatAlarmSettingThreshold, formatDateWithMomentLongFormat } from '../../../../lib/utils'

jest.mock('../../../../lib/team')
describe('Weekly report dialog', () => {
  const teamId = 'teamId'
  const patientId = 'patientId'
  const patient = createPatient(patientId, [createPatientTeam(teamId, UserInvitationStatus.accepted)])
  const onClose = jest.fn()
  const weeklyReport: WeeklyReport = {
    id: 'fakeId',
    patientId,
    teamId,
    parameters: {
      bgUnit: UNITS_TYPE.MGDL,
      lowBg: 1,
      highBg: 2,
      outOfRangeThreshold: 3,
      veryLowBg: 4,
      hypoThreshold: 5,
      nonDataTxThreshold: 6,
      reportingPeriod: 7
    },
    alarms: {} as Alarm,
    creationDate: '2022-02-02'
  }

  const endDatePeriod = new Date(weeklyReport.creationDate)
  const startDatePeriod = new Date(weeklyReport.creationDate)
  startDatePeriod.setDate(startDatePeriod.getDate() - 7)

  function renderComponent() {
    return render(<WeeklyReportDialog onClose={onClose} weeklyReport={weeklyReport} />)
  }

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getPatient: () => patient }
    })
  })

  it('should call onClose method when clicking on close button', () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: 'button-close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('should display right information', () => {
    renderComponent()
    expect(screen.getByLabelText('firstname')).toHaveTextContent(patient.profile.firstName)
    expect(screen.getByLabelText('lastname')).toHaveTextContent(patient.profile.lastName)
    expect(screen.getByLabelText('birthdate')).toHaveTextContent(formatDateWithMomentLongFormat(patient.profile.birthdate))
    expect(screen.getByLabelText('gender')).toHaveTextContent(patient.profile.sex)
    expect(screen.getByLabelText('email')).toHaveTextContent(patient.profile.email)
    expect(screen.getByLabelText('monitoring-team')).toHaveTextContent('fakeTeamName')
    expect(screen.getByLabelText('created-at')).toHaveTextContent(formatDateWithMomentLongFormat(endDatePeriod))
    expect(screen.getByLabelText('monitoring-period')).toHaveTextContent(`${formatDateWithMomentLongFormat(startDatePeriod)} - ${formatDateWithMomentLongFormat(endDatePeriod)}`)
    expect(screen.getByLabelText('time-out-of-range-target')).toHaveTextContent(formatAlarmSettingThreshold(weeklyReport.alarms.timeSpentAwayFromTargetRate))
    expect(screen.getByLabelText('glycemic-target')).toHaveTextContent(`${weeklyReport.parameters.lowBg} ${weeklyReport.parameters.bgUnit} - ${weeklyReport.parameters.highBg} ${weeklyReport.parameters.bgUnit}`)
    expect(screen.getByLabelText('glycemic-target-event-trigger-threshold')).toHaveTextContent(`${weeklyReport.parameters.outOfRangeThreshold}%`)
    expect(screen.getByLabelText('severe-hypoglycemia')).toHaveTextContent(formatAlarmSettingThreshold(weeklyReport.alarms.frequencyOfSevereHypoglycemiaRate))
    expect(screen.getByLabelText('severe-hypoglycemia-below')).toHaveTextContent(`${weeklyReport.parameters.veryLowBg} ${weeklyReport.parameters.bgUnit}`)
    expect(screen.getByLabelText('severe-hypoglycemia-event-trigger-threshold')).toHaveTextContent(`${weeklyReport.parameters.hypoThreshold}%`)
    expect(screen.getByLabelText('data-not-transmitted')).toHaveTextContent(formatAlarmSettingThreshold(weeklyReport.alarms.nonDataTransmissionRate))
    expect(screen.getByLabelText('data-not-transmitted-event-trigger-threshold')).toHaveTextContent(`${weeklyReport.parameters.nonDataTxThreshold}%`)
  })
})
