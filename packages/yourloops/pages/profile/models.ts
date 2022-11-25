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
import { Units } from '../../models/generic'
import { LanguageCodes } from '../../models/locales'
import { HcpProfession } from '../../models/hcp-profession'

export type ProfileErrors = Record<string, boolean>

export enum ProfileFormKey {
  firstName = 'firstName',
  lastName = 'lastName',
  lang = 'lang',
  units = 'units',
  birthday = 'birthday',
  birthPlace = 'birthPlace',
  feedbackAccepted = 'feedbackAccepted',
  hcpProfession = 'hcpProfession',
  ins = 'ins',
  referringDoctor = 'referringDoctor',
  sex = 'sex',
  ssn = 'ssn',
  birthLastName = 'birthLastName',
  birthFirstName = 'birthFirstName',
  birthNames = 'birthNames',
  oid = 'oid',
  birthPlaceInseeCode = 'birthPlaceInseeCode'
}

export interface ProfileForm {
  firstName: string
  lastName: string
  lang: LanguageCodes
  units: Units
  birthday: string | undefined
  birthPlace: string
  feedbackAccepted: boolean | undefined
  hcpProfession: HcpProfession
  ins: string | undefined
  referringDoctor: string | undefined
  sex: string | undefined
  ssn: string | undefined
  birthLastName: string
  birthFirstName: string
  birthNames: string
  oid: string
  birthPlaceInseeCode: string
}
