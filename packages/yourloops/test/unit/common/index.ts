/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { User } from '../../../lib/auth'
import { Units } from '../../../models/generic'
import { AuthenticatedUserMetadata, UserRoles } from '../../../models/user'
import { HcpProfession } from '../../../models/hcp-profession'
import { CountryCodes } from '../../../models/locales'

const getNewHcp = (): User => {
  return new User({
    email: 'john.doe@example.com',
    email_verified: true,
    sub: 'auth0|123456789',
    [AuthenticatedUserMetadata.Roles]: [UserRoles.hcp]
  })
}

const getHcp = (): User => {
  const hcp = new User({
    email: 'john.doe@example.com',
    email_verified: true,
    sub: 'auth0|a0000000',
    [AuthenticatedUserMetadata.Roles]: [UserRoles.hcp]
  })
  hcp.frProId = 'ANS20211229094028'
  hcp.profile = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    hcpProfession: HcpProfession.diabeto,
    email: 'fake@email.com'
  }
  hcp.preferences = { displayLanguageCode: 'en' }
  hcp.settings = { units: { bg: Units.gram }, country: CountryCodes.France }
  return hcp
}

const getCaregiver = (): User => {
  const caregiver = new User({
    email: 'caregiver@example.com',
    email_verified: true,
    sub: 'auth0|b0000000',
    [AuthenticatedUserMetadata.Roles]: [UserRoles.caregiver]
  })
  caregiver.profile = {
    firstName: 'Caregiver',
    lastName: 'Example',
    fullName: 'Caregiver Example',
    email: 'fake@email.com'
  }
  caregiver.preferences = { displayLanguageCode: 'de' }
  caregiver.settings = { country: CountryCodes.Germany, units: { bg: Units.mole } }
  return caregiver
}

const getPatient = (): User => {
  const patient = new User({
    email: 'josephine.dupuis@example.com',
    email_verified: true,
    sub: 'auth0|a0a0a0b0',
    [AuthenticatedUserMetadata.Roles]: [UserRoles.patient]
  })
  patient.settings = { a1c: { date: '2020-01-01', value: '7.5' }, country: CountryCodes.France }
  patient.profile = {
    email: 'fake@email.com',
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
