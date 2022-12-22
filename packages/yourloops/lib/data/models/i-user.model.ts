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

import { Alarms } from '../../patient/models/alarms.model'
import { Monitoring } from '../../team/models/monitoring.model'
import { MedicalData } from './medical-data.model'
import { UserRoles } from '../../auth/models/enums/user-roles.enum'
import { Profile } from '../../auth/models/profile.model'
import { Settings } from '../../auth/models/settings.model'
import { Preferences } from '../../auth/models/preferences.model'

export interface IUser {
  emails?: string[]
  readonly emailVerified?: boolean
  frProId?: string
  /** A boolean that indicates if the user has certified another account, like eCPS */
  readonly idVerified?: boolean
  /** Main role of the user */
  readonly role: UserRoles
  roles?: UserRoles[]
  readonly userid: string
  readonly username: string
  profile?: Profile | null
  settings?: Settings | null
  preferences?: Preferences | null
  /** Patient medical data. undefined means not fetched, null if the fetch failed */
  medicalData?: MedicalData | null
  alarms?: Alarms | null
  monitoring?: Monitoring
  unreadMessages?: number
}
