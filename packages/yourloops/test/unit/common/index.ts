/*
 * Copyright (c) 2021-2023, Diabeloop
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
import { HcpProfession } from '../../../lib/auth/models/enums/hcp-profession.enum'
import { AuthenticatedUserMetadata } from '../../../lib/auth/models/enums/authenticated-user-metadata.enum'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { CountryCodes } from '../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../lib/auth/models/enums/language-codes.enum'
import { Unit } from 'medical-domain'

const getHcp = (): User => {
  const email = 'john.doe@example.com'
  const hcp = new User({
    email,
    email_verified: true,
    sub: 'auth0|a0000000',
    [AuthenticatedUserMetadata.Roles]: [UserRole.Hcp]
  })
  hcp.frProId = 'ANS20211229094028'
  hcp.profile = { email, firstName: 'John', lastName: 'Doe', fullName: 'John Doe', hcpProfession: HcpProfession.diabeto }
  hcp.preferences = { displayLanguageCode: 'en' }
  hcp.settings = { units: { bg: Unit.MilligramPerDeciliter }, country: CountryCodes.France }
  return hcp
}

const getCaregiver = (): User => {
  const email = 'caregiver@example.com'
  const caregiver = new User({
    email,
    email_verified: true,
    sub: 'auth0|b0000000',
    [AuthenticatedUserMetadata.Roles]: [UserRole.Caregiver]
  })
  caregiver.profile = { email, firstName: 'Caregiver', lastName: 'Example', fullName: 'Caregiver Example' }
  caregiver.preferences = { displayLanguageCode: 'de' }
  caregiver.settings = { country: CountryCodes.Germany, units: { bg: Unit.MmolPerLiter } }
  return caregiver
}

const getPatient = (): User => {
  const email = 'josephine.dupuis@example.com'
  const patient = new User({
    email,
    email_verified: true,
    sub: 'auth0|a0a0a0b0',
    [AuthenticatedUserMetadata.Roles]: [UserRole.Patient]
  })
  patient.settings = { a1c: { rawdate: '2020-01-01', date: '2020-01-01', value: '7.5' }, country: CountryCodes.France }
  patient.profile = {
    email,
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
  patient.preferences = { displayLanguageCode: LanguageCodes.Fr }
  return patient
}

/**
 * Logged-in users for test, choose one suitable
 */
export const loggedInUsers = { getHcp, getPatient, getCaregiver }
