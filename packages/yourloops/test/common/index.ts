/**
 * Copyright (c) 2021, Diabeloop
 * Commons data for all tests
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

import { User } from '../../lib/auth'
import { Units } from '../../models/generic'
import { UserMetadata, UserRoles } from '../../models/user'
import { HcpProfession } from '../../models/hcp-profession'

const getNewHcp = (): User => {
  return new User({
    email: 'john.doe@example.com',
    emailVerified: true,
    sub: 'auth0|123456789',
    [UserMetadata.Roles]: [UserRoles.hcp]
  })
}

const getHcp = (): User => {
  const hcp = new User({
    email: 'john.doe@example.com',
    emailVerified: true,
    sub: 'auth0|a0000000',
    [UserMetadata.Roles]: [UserRoles.hcp]
  })
  hcp.frProId = 'ANS20211229094028'
  hcp.profile = { firstName: 'John', lastName: 'Doe', fullName: 'John Doe', hcpProfession: HcpProfession.diabeto }
  hcp.preferences = { displayLanguageCode: 'en' }
  hcp.settings = { units: { bg: Units.gram }, country: 'FR' }
  return hcp
}

const getCaregiver = (): User => {
  const caregiver = new User({
    email: 'caregiver@example.com',
    emailVerified: true,
    sub: 'auth0|b0000000',
    [UserMetadata.Roles]: [UserRoles.caregiver]
  })
  caregiver.profile = { firstName: 'Caregiver', lastName: 'Example', fullName: 'Caregiver Example' }
  caregiver.preferences = { displayLanguageCode: 'de' }
  caregiver.settings = { country: 'DE', units: { bg: Units.mole } }
  return caregiver
}

const getPatient = (): User => {
  const patient = new User({
    email: 'josephine.dupuis@example.com',
    emailVerified: true,
    sub: 'auth0|a0a0a0b0',
    [UserMetadata.Roles]: [UserRoles.patient]
  })
  patient.settings = { a1c: { date: '2020-01-01', value: '7.5' }, country: 'FR' }
  patient.profile = {
    firstName: 'Josephine',
    lastName: 'Dupuis',
    fullName: 'Josephine D.',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      referringDoctor: 'Dr Dre',
      sex: 'M',
      ins: '123456789012345',
      ssn: '012345678901234'
    }
  }
  patient.preferences = { displayLanguageCode: 'fr' }
  return patient
}

/**
 * Logged-in users for test, choose one suitable
 */
export const loggedInUsers = { getHcp, getPatient, getCaregiver, getNewHcp }
