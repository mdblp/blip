/**
 * Copyright (c) 2022, Diabeloop
 * Data API
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

import { sortBy } from "lodash";
import HttpService, { ErrorMessageStatus } from "../../services/http";
import { Patient } from "./patient";
import { GetPatientDataOptions } from "./models";
import { PatientData } from "../../models/device-data";
import { IUser } from "../../models/shoreline";
import MessageNote from "../../models/message";
import User from "../auth/user";
import { HttpHeaderKeys, HttpHeaderValues } from "../../models/api";
import { Units } from "../../models/generic";
import bows from "bows";

const log = bows("Data API");

export default class DataApi {
  static async getPatientDataRange(patientId: string): Promise<string[] | null> {
    try {
      const { data } = await HttpService.get<string[]>({ url: `/data/v2/range/${patientId}` });
      return data;
    } catch (err) {
      const error = err as Error;
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No data for patient ${patientId}`);
        return null;
      }
      throw err;
    }
  }

  static async getPatientData(patient: Patient, options?: GetPatientDataOptions): Promise<PatientData> {
    const params = {
      starDate: options?.startDate,
      endDate: options?.endDate,
      withPumpSettings: options?.withPumpSettings ? true : undefined,
    };
    const { data } = await HttpService.get<PatientData>({
      url: `/data/v1/dataV2/${patient.userid}`,
      config: { params },
    });
    return data;
  }

  static async getMessages(patient: IUser, options?: GetPatientDataOptions): Promise<MessageNote[]> {
    try {
      const params = {
        starttime: options?.startDate,
        endtime: options?.endDate,
      };
      const { data } = await HttpService.get<MessageNote[]>({
        url: `/message/v1/notes/${patient.userid}`,
        config: { params },
      });
      return data;
    } catch (err) {
      const error = err as Error;
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No messages for patient ${patient.userid}`);
        return [];
      }
      throw err;
    }
  }

  static async editMessage(message: MessageNote): Promise<void> {
    await HttpService.put<void, MessageNote>({
      url: "/message/v1/edit",
      payload: message,
    });
  }

  static async exportData(user: User, patientId: string, startDate: string, endDate: string): Promise<Blob> {
    const bgUnits = user.settings?.units ?? Units.gram;
    const { data } = await HttpService.get<Blob>({
      url: `/export/${patientId}`,
      config: {
        headers: { [HttpHeaderKeys.contentType]: HttpHeaderValues.csv },
        params: { bgUnits, startDate, endDate },
      },
    });
    return data;
  }

  static async getMessageThread(messageId: string): Promise<MessageNote[]> {
    const { data } = await HttpService.get<MessageNote[]>({ url: `/message/v1/thread/${messageId}` });
    return sortBy(data, (message: MessageNote) => Date.parse(message.timestamp));
  }

  static async postMessageThread(message: MessageNote): Promise<string> {
    const { data } = await HttpService.post<{ id: string }, MessageNote>({
      url: "/message/v1/send",
      payload: message,
    });
    return data.id;
  }
}
