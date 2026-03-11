/*
 * Copyright (c) 2026, Diabeloop
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

import {
  testAddClinicianError,
  testCliniciansEmptyList,
  testCliniciansFiveClinicians,
  testCliniciansOneClinician,
  testHcpAddClinician,
  testHcpRemoveClinician,
  testPatientAddClinician,
  testPatientRemoveClinician, testRemoveClinicianError
} from '../assert/clinicians.assert'

export const checkCliniciansEmptyList = async (): Promise<void> => {
  testCliniciansEmptyList()
}

export const checkCliniciansManagementPatient = async (): Promise<void> => {
  await testCliniciansOneClinician()
  await testPatientRemoveClinician()
  await testPatientAddClinician()
}

export const checkCliniciansManagementHcp = async (): Promise<void> => {
  await testCliniciansOneClinician()
  await testHcpRemoveClinician()
  await testHcpAddClinician()
}

export const checkCliniciansFiveClinicians = async (): Promise<void> => {
  await testCliniciansFiveClinicians()
}

export const checkCliniciansManagementErrors = async (): Promise<void> => {
  await testRemoveClinicianError()
  await testAddClinicianError()
}
