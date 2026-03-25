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

import { Team } from '../../lib/team'
import { isZipCodeValid, REGEX_EMAIL, REGEX_PHONE } from '../../lib/utils'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { CountryCodes } from '../../lib/auth/models/country.model'
import locales from '../../../../locales/languages.json'
import { useAuth } from '../../lib/auth'
import MenuItem from '@mui/material/MenuItem'

type LocalesCountries = Record<string, {
  name: string
}>

interface TeamCreateEditHookProps {
  team: Partial<Team> | null
  onSaveTeam: (team: Partial<Team>) => Promise<void> | void
}

interface TeamCreateEditHookReturn {
  teamName: string
  teamPhone: string
  teamEmail: string
  addrLine1: string
  addrLine2: string
  addrZipCode: string
  addrCity: string
  addrCountry: string
  setTeamName: Dispatch<SetStateAction<string>>
  setTeamPhone: Dispatch<SetStateAction<string>>
  setTeamEmail: Dispatch<SetStateAction<string>>
  setAddrLine1: Dispatch<SetStateAction<string>>
  setAddrLine2: Dispatch<SetStateAction<string>>
  setAddrZipCode: Dispatch<SetStateAction<string>>
  setAddrCity: Dispatch<SetStateAction<string>>
  setAddrCountry: Dispatch<SetStateAction<string>>
  optionsCountries: JSX.Element[]
  phoneNumberInputOnError: boolean
  emailInputOnError: boolean
  zipcodeInputOnError: boolean
  isFormInvalid: boolean
  handleValidateModal: () => void
}

const TEAM_FIELDS_LIMIT = {
  name: { min: 1, max: 64 },
  phone: { min: 3, max: 32 },
  addLine1: { min: 1, max: 128 },
  addLine2: { min: -1, max: 128 },
  zipCode: { min: 1, max: 16 },
  city: { min: 1, max: 128 },
  country: { min: 1, max: 4 },
  email: { min: 0, max: 64 }
}

export const useTeamCreateEdit = (props: TeamCreateEditHookProps): TeamCreateEditHookReturn => {
  const { team, onSaveTeam } = props
  const authContext = useAuth()

  const [teamName, setTeamName] = useState(team?.name ?? '')
  const [teamPhone, setTeamPhone] = useState(team?.phone ?? '')
  const [teamEmail, setTeamEmail] = useState(team?.email ?? '')
  const [addrLine1, setAddrLine1] = useState(team?.address?.line1 ?? '')
  const [addrLine2, setAddrLine2] = useState(team?.address?.line2 ?? '')
  const [addrZipCode, setAddrZipCode] = useState(team?.address?.zip ?? '')
  const [addrCity, setAddrCity] = useState(team?.address?.city ?? '')
  const [addrCountry, setAddrCountry] = useState(team?.address?.country ?? authContext.user?.settings?.country ?? CountryCodes.France)

  const countries: LocalesCountries = locales.countries
  const optionsCountries: JSX.Element[] = []
  const isPhoneNumberValid: boolean = REGEX_PHONE.test(teamPhone)
  const isEmailValid: boolean = REGEX_EMAIL.test(teamEmail)
  const zipcodeInputOnError: boolean = !(addrZipCode.length === 0 || isZipCodeValid(addrCountry, addrZipCode))
  const phoneNumberInputOnError: boolean = !(teamPhone.length === 0 || isPhoneNumberValid)
  const emailInputOnError: boolean = (!(teamEmail.length === 0 || isEmailValid))

  for (const entry in countries) {
    if (Object.hasOwn(countries, entry)) {
      const { name } = countries[entry]
      optionsCountries.push(
        <MenuItem
          id={`team-edit-dialog-select-country-item-${entry}`}
          value={entry}
          key={name}
          aria-label={name}
        >
          {name}
        </MenuItem>
      )
    }
  }
  optionsCountries.sort((a: JSX.Element, b: JSX.Element) => {
    const aName = a.key
    const bName = b.key
    return aName.localeCompare(bName)
  })

  const checkFormValidity = (): boolean => {
    const inLimit = (value: string, limits: { min: number, max: number }): boolean => {
      const len = value.length
      return len > limits.min && len < limits.max
    }
    let valid = inLimit(teamName.trim(), TEAM_FIELDS_LIMIT.name)
    valid = valid && inLimit(teamPhone.trim(), TEAM_FIELDS_LIMIT.phone)
    valid = valid && inLimit(addrLine1.trim(), TEAM_FIELDS_LIMIT.addLine1)
    valid = valid && inLimit(addrLine2.trim(), TEAM_FIELDS_LIMIT.addLine2)
    valid = valid && inLimit(addrZipCode.trim(), TEAM_FIELDS_LIMIT.zipCode)
    valid = valid && inLimit(addrCity.trim(), TEAM_FIELDS_LIMIT.city)
    valid = valid && inLimit(addrCountry.trim(), TEAM_FIELDS_LIMIT.country)
    const email = teamEmail.trim()
    if (valid && inLimit(email, TEAM_FIELDS_LIMIT.email)) {
      valid = REGEX_EMAIL.test(email)
    }
    return (zipcodeInputOnError || phoneNumberInputOnError) || !valid
  }

  const isFormInvalid = useMemo(checkFormValidity, [
    teamName,
    teamEmail,
    teamPhone,
    addrCity,
    addrCountry,
    addrLine1,
    addrLine2,
    addrZipCode,
    zipcodeInputOnError,
    phoneNumberInputOnError
  ])

  const handleValidateModal = (): void => {
    const updatedTeam = team === null ? {} as Partial<Team> : { ...team, members: [] }
    updatedTeam.name = teamName.trim()
    updatedTeam.phone = teamPhone.trim()

    const email = teamEmail.trim()
    if (email.length > 0) {
      updatedTeam.email = email
    } else {
      delete updatedTeam.email
    }

    updatedTeam.address = {
      line1: addrLine1.trim(),
      line2: addrLine2.trim(),
      zip: addrZipCode.trim(),
      city: addrCity.trim(),
      country: addrCountry.trim()
    }
    if ((updatedTeam.address.line2?.length ?? 0) < 1) {
      delete updatedTeam.address.line2
    }
    onSaveTeam(updatedTeam)
  }

  return {
    teamName,
    teamPhone,
    teamEmail,
    addrLine1,
    addrLine2,
    addrZipCode,
    addrCity,
    addrCountry,
    setTeamName,
    setTeamPhone,
    setTeamEmail,
    setAddrLine1,
    setAddrLine2,
    setAddrZipCode,
    setAddrCity,
    setAddrCountry,
    optionsCountries,
    phoneNumberInputOnError,
    emailInputOnError,
    zipcodeInputOnError,
    isFormInvalid,
    handleValidateModal
  }
}
