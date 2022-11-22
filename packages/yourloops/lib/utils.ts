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

import { Units } from '../models/generic'
import { IUser, Settings } from '../models/user'
import { t } from './language'
import metrics from './metrics'
import moment from 'moment-timezone'

// Matches the Amazon SES emails rules (only 7-bit ASCII)
export const REGEX_EMAIL = /^[A-Za-z0-9][A-Za-z0-9._%+-]{0,64}@(?:(?=[A-Za-z0-9-]{1,63}\.)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.){1,8}[A-Za-z]{2,63}$/
export const REGEX_BIRTHDATE = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
export const REGEX_PHONE = /^[0-9]{8,10}$/
export const REGEX_ZIPCODE_WITHOUT_STRING = /^[0-9-]*$/
export const REGEX_ZIPCODE_WITH_STRING = /^[A-Z0-9 ]*$/

export enum PhonePrefixCode {
  FR = '+33',
  AT = '+43',
  BE = '+32',
  DE = '+49',
  IT = '+39',
  JA = '+81',
  NL = '+31',
  ES = '+34',
  CH = '+41',
  GB = '+44',
}

export const isZipCodeValid = (country: string, zipCode: string): boolean => {
  switch (country) {
    case 'NL':
    case 'GB':
      return REGEX_ZIPCODE_WITH_STRING.test(zipCode)
    default:
      return REGEX_ZIPCODE_WITHOUT_STRING.test(zipCode)
  }
}

/**
 * setTimeout() as promised
 * @param timeout in milliseconds
 */
export async function waitTimeout(timeout: number): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

/**
 * Defer the execution on a function
 * @param fn A function
 * @param timeout optional delay to wait
 */
export async function defer(fn: () => void, timeout = 1): Promise<void> {
  try {
    await waitTimeout(timeout)
    fn()
  } catch (err) {
    console.error(err)
  }
}

export function errorTextFromException(reason: unknown): string {
  let errorMessage: string
  if (reason instanceof Error) {
    errorMessage = reason.message
  } else {
    const s = String(reason)
    errorMessage = s.toString()
  }
  return errorMessage
}

/**
 * Return the user first name
 */
export function getUserFirstName(user: IUser): string {
  return user.profile?.firstName ?? ''
}

/**
 * Return the user last name
 */
export function getUserLastName(user: IUser): string {
  return user.profile?.lastName ?? user.profile?.fullName ?? user.username
}

/**
 * @param user The user to have firstName / lastName
 * @returns The object for "user-name" translation string
 */
export function getUserFirstLastName(user: IUser): { firstName: string, lastName: string } {
  return { firstName: getUserFirstName(user), lastName: getUserLastName(user) }
}

/**
 * YLP-878 Wrong settings for glucose units uploaded by the handset
 * @param settings Settings received
 * @returns Fixed settings
 */
export function fixYLP878Settings(settings: Settings | undefined | null): Settings {
  if (!settings) {
    return {
      country: 'FR',
      units: {
        bg: Units.gram
      }
    }
  }
  let bgUnit = settings.units?.bg ?? Units.gram
  if (![Units.gram, Units.mole].includes(bgUnit)) {
    bgUnit = Units.gram
  }
  const newSettings: Settings = {
    country: settings.country ?? 'FR',
    units: { bg: bgUnit }
  }
  if (settings.a1c) {
    newSettings.a1c = settings.a1c
  }
  return newSettings
}

/**
 * Set the page title
 * @param prefix The text prefix
 * @param metricsTitle The text for the metrics, to keeps this page title anonymous
 */
export function setPageTitle(prefix?: string, metricsTitle?: string): void {
  const title = prefix ? `${prefix} | ${t('brand-name')}` : t('brand-name')
  if (document.title !== title) {
    document.title = title
    metrics.send('metrics', 'setDocumentTitle', metricsTitle ?? title)
  }
}

export function formatDateWithMomentLongFormat(date?: Date): string {
  return moment.utc(date).format(moment.localeData().longDateFormat('ll')).toString()
}

export function formatAlarmSettingThreshold(value: number): string {
  return `${Math.round(value * 10) / 10}%`
}

export function isEllipsisActive(element: HTMLElement | null): boolean | undefined {
  return element ? element.offsetWidth < element.scrollWidth : undefined
}
