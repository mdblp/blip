/**
 * Copyright (c) 2021, Diabeloop
 * Blip API class to be used by blip v1
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

import bows from 'bows'

import { PatientData } from 'models/device-data'
import MessageNote from 'models/message'
import { IUser } from '../../models/user'
import { AuthContext, User } from '../auth'
import { t as translate } from '../language'
import metrics from '../metrics'

import { GetPatientDataOptions } from './models'
import { Patient } from './patient'
import DataApi from './data-api'

/**
 * Wrapper for blip v1 to be able to call the API
 */
class BlipApi {
  private readonly log: Console
  private authHook: AuthContext
  public metrics: typeof metrics

  constructor(authHook: AuthContext) {
    this.authHook = authHook
    this.metrics = metrics
    this.log = bows('BlipAPI')
  }

  // eslint-disable-next-line accessor-pairs
  public set authContext(context: AuthContext) {
    this.authHook = context
  }

  public get whoami(): User | null {
    return this.authHook.user ?? null
  }

  public async getPatientDataRange(patient: IUser): Promise<string[] | null> {
    this.log.debug('getPatientDataRange', { userId: patient.userid })
    const user = this.authHook.user
    if (user) {
      return await DataApi.getPatientDataRange(patient.userid)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async getPatientData(patient: Patient, options?: GetPatientDataOptions): Promise<PatientData> {
    this.log.debug('getPatientData', { userId: patient.userid, options })
    const user = this.authHook.user
    if (user) {
      metrics.startTimer('load_data')
      return await DataApi.getPatientData(patient, options).then(async (r) => {
        metrics.endTimer('load_data')
        return await Promise.resolve(r)
      }).catch(async (r) => {
        metrics.endTimer('load_data')
        return await Promise.reject(r)
      })
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async getMessages(patient: IUser, options?: GetPatientDataOptions): Promise<MessageNote[]> {
    this.log.debug('getMessages', { userId: patient.userid, options })
    const user = this.authHook.user
    if (user) {
      return await DataApi.getMessages(patient, options)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async getMessageThread(messageId: string): Promise<MessageNote[]> {
    this.log.debug('getMessageThread', { messageId })
    const user = this.authHook.user
    if (user) {
      return await DataApi.getMessageThread(messageId)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async startMessageThread(message: MessageNote): Promise<string> {
    this.log.debug('startMessageThread', { userId: message.userid })
    const user = this.authHook.user
    if (user) {
      return await DataApi.postMessageThread(message)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async replyMessageThread(message: MessageNote): Promise<string> {
    this.log.debug('replyMessageThread', { userId: message.userid })
    const user = this.authHook.user
    if (user) {
      return await DataApi.postMessageThread(message)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async editMessage(message: MessageNote): Promise<void> {
    this.log.debug('editMessage', { userId: message.userid })
    const user = this.authHook.user
    if (user) {
      return await DataApi.editMessage(message)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }

  public async exportData(patient: IUser, startDate: string, endDate: string): Promise<string> {
    this.log.debug('exportData', { userId: patient.userid })
    const user = this.authHook.user
    if (user) {
      return await DataApi.exportData(user, patient.userid, startDate, endDate)
    }
    return await Promise.reject(new Error(translate('not-logged-in')))
  }
}

export default BlipApi
