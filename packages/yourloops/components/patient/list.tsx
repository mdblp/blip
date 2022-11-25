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

import _ from 'lodash'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Container from '@material-ui/core/Container'

import { PatientFilterTypes, PatientTableSortFields, SortDirection } from '../../models/generic.model'
import metrics from '../../lib/metrics'
import { useAuth } from '../../lib/auth'
import { setPageTitle } from '../../lib/utils'
import PatientsTable from './table'
import { Patient } from '../../lib/data/patient.model'
import { PatientListProps } from './models'
import { comparePatients } from './utils'
import { usePatientContext } from '../../lib/patient/provider'
import PatientUtils from '../../lib/patient/utils'

const throttleSearchMetrics = _.throttle(metrics.send, 10000, { trailing: true })

function PatientList(props: PatientListProps): JSX.Element {
  const { filter, filterType } = props
  const { t } = useTranslation('yourloops')
  const authHook = useAuth()
  const patientHook = usePatientContext()
  const [order, setOrder] = React.useState<SortDirection>(SortDirection.asc)
  const [orderBy, setOrderBy] = React.useState<PatientTableSortFields>(PatientTableSortFields.patientFullName)
  const flagged = authHook.getFlagPatients()

  const updatePatientList = useCallback(
    (
      flagged: string[],
      filter: string,
      filterType: PatientFilterTypes,
      orderBy: PatientTableSortFields,
      order: SortDirection
    ) => {
      let filteredPatients = patientHook.filterPatients(filterType, filter, flagged)
      filteredPatients = PatientUtils.computeFlaggedPatients(filteredPatients, flagged)
      // Sort the patients
      filteredPatients.sort((a: Patient, b: Patient): number => {
        const c = comparePatients(a, b, orderBy)
        return order === SortDirection.asc ? c : -c
      })
      const searchByName = filter.length > 0
      if (searchByName) {
        throttleSearchMetrics('trackSiteSearch', 'patient_name', 'hcp', filteredPatients.length)
      }
      return filteredPatients
    }, [patientHook])

  const handleSortList = (orderBy: PatientTableSortFields, order: SortDirection): void => {
    metrics.send('patient_selection', 'sort_patients', orderBy, order === SortDirection.asc ? 1 : -1)
    setOrder(order)
    setOrderBy(orderBy)
  }

  const patients = React.useMemo(() => {
    return updatePatientList(flagged, filter, filterType, orderBy, order)
  }, [updatePatientList, flagged, filter, filterType, orderBy, order])

  React.useEffect(() => {
    setPageTitle(t('hcp-tab-patients'))
  }, [t])

  return (
    <Container id="patient-list-container" maxWidth={false}>
      <PatientsTable
        patients={patients}
        order={order}
        orderBy={orderBy}
        filter={filterType}
        onSortList={handleSortList}
      />
    </Container>
  )
}

export default PatientList
