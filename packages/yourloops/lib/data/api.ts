/**
 * Copyright (c) 2021, Diabeloop
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

import { v4 as uuidv4 } from "uuid";
import bows from "bows";
import _ from "lodash";

import { PatientData } from "models/device-data";
import { MessageNote, MessagesThread } from "models/message";
import { HttpHeaderKeys, HttpHeaderValues } from "../../models/api";
import { APITideWhispererErrorResponse } from "../../models/error";
import { ComputedTIR } from "../../models/device-data";
import { IUser, UserRoles } from "../../models/shoreline";

import HttpStatus from "../http-status-codes";
import appConfig from "../config";
import { t } from "../language";
import { errorFromHttpStatus } from "../utils";
import { Session } from "../auth";
import { GetPatientDataOptionsV0, GetPatientDataOptions } from "./models";

const log = bows("data-api");
/** true if the v1 routes of tide-whisperer are available, default to true */
let routeV1Available = true;

export async function getPatientsDataSummary(session: Session, userId: string, options?: GetPatientDataOptionsV0): Promise<ComputedTIR> {
  const dataURL = new URL(`/compute/tir` , appConfig.API_HOST);
  dataURL.searchParams.set("userIds", userId);

  if (options) {
    if (options.startDate) {
      dataURL.searchParams.set("startDate", options.startDate);
    }
    if (options.endDate) {
      dataURL.searchParams.set("endDate", options.endDate);
    }
  }

  const { sessionToken, traceToken } = session;
  const response = await fetch(dataURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    const result = await response.json() as ComputedTIR[];
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

function getPatientDataRouteV0(session: Session, patient: IUser, options?: GetPatientDataOptionsV0): Promise<Response> {
  const { sessionToken, traceToken } = session;
  const dataURL = new URL(`/data/${patient.userid}` , appConfig.API_HOST);

  if (options) {
    if (options.latest) {
      dataURL.searchParams.set("latest", "true");
    }
    if (Array.isArray(options.types) && options.types.length > 0) {
      dataURL.searchParams.append("type", options.types.join(','));
    }
    if (options.startDate) {
      dataURL.searchParams.set("startDate", options.startDate);
    }
    if (options.endDate) {
      dataURL.searchParams.set("endDate", options.endDate);
    }
  }

  return fetch(dataURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });
}

/**
 * Fetch data using tide-whisperer v0 route
 * @param session Session information
 * @param patient The patient (user) to fetch data
 * @param options Request options
 * @returns Array of patient data
 */
export async function getPatientDataV0(session: Session, patient: IUser, options?: GetPatientDataOptionsV0): Promise<PatientData> {
  if (patient.role !== UserRoles.patient) {
    return Promise.reject(new Error(t("not-a-patient")));
  }

  const response = await getPatientDataRouteV0(session, patient, options);

  if (response.ok) {
    const patientData = (await response.json()) as PatientData;
    return patientData;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

function getPatientDataRangeV1(session: Session, patient: IUser): Promise<Response> {
  const { sessionToken, traceToken } = session;
  if (patient.role !== UserRoles.patient) {
    return Promise.reject(new Error(t("not-a-patient")));
  }

  const dataURL = new URL(`/data/v1/range/${patient.userid}`, appConfig.API_HOST);
  return fetch(dataURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });
}

/**
 * Fetch data range using tide-whisperer v1 route
 * @param session Session information
 * @param patient The patient (user) to fetch data
 * @returns Array [string, string] of ISO 8601 dates time
 */
export async function getPatientDataRange(session: Session, patient: IUser): Promise<string[] | null> {
  let response: Response | null = null;
  if (routeV1Available) {
    response = await getPatientDataRangeV1(session, patient);
    if (response.ok) {
      const dataRange = (await response.json()) as string[];
      if (!Array.isArray(dataRange) || dataRange.length !== 2) {
        return Promise.reject(new Error("Invalid response"));
      }
      return dataRange;
    } else if (response.status === HttpStatus.StatusNotFound) {
      try {
        const text = await response.text();
        if (text.length > 0) {
          const errorResponse = JSON.parse(text) as APITideWhispererErrorResponse;
          if (_.get(errorResponse, "status", 0) === HttpStatus.StatusNotFound) {
            // This is a /v1 route response, no patient data
            return null;
          }
        }
      } catch (_err) {
        // Ignore
      }
      routeV1Available = false;
    }
  }

  if (!routeV1Available) {
    // Fetch the latest data of all types & uploads (we must have the oldest data in the uploads)
    const [ responseUpload, responseLatest ] = await Promise.all([
      getPatientDataRouteV0(session, patient, { latest: true }),
      getPatientDataRouteV0(session, patient, { types: ["upload"] }),
    ]);

    if (responseUpload.ok && responseLatest.ok) {
      const latests = (await responseLatest.json()) as { time: string; type: string; timeProcessing: number; }[];
      const uploads = (await responseUpload.json()) as { time: string; type: string; timeProcessing: number; }[];
      if (Array.isArray(latests) && Array.isArray(uploads) && latests.length > 0 && uploads.length > 0) {
        const data = latests.concat(uploads);
        data.forEach((d) => {
          d.timeProcessing = Date.parse(d.time);
        });
        data.sort((a, b) => a.timeProcessing - b.timeProcessing);
        const startDate = new Date(data[0].timeProcessing).toISOString();

        // For the last datum, use only the cbg if present
        let lastDatum = data.find((d) => d.type === "cbg");
        if (lastDatum === undefined) {
          lastDatum = data[data.length - 1];
        }
        const endDate = new Date(lastDatum.timeProcessing).toISOString();
        return [startDate, endDate];
      }
      return null;
    }

    response = responseUpload;
  }

  if (response) {
    return Promise.reject(errorFromHttpStatus(response, log));
  }

  return Promise.reject(new Error("Logic error"));
}

/**
 * Fetch data using tide-whisperer v1 route
 * @param session Session information
 * @param patient The patient (user) to fetch data
 * @param options Options to pas to the API
 * @returns Patient data array
 */
export async function getPatientData(session: Session, patient: IUser, options?: GetPatientDataOptions): Promise<PatientData> {
  const { sessionToken, traceToken } = session;
  if (patient.role !== UserRoles.patient) {
    return Promise.reject(new Error(t("not-a-patient")));
  }

  const dataURL = new URL(`/data/v1/data/${patient.userid}`, appConfig.API_HOST);

  if (options) {
    if (options.withPumpSettings) {
      dataURL.searchParams.set("withPumpSettings", "true");
    }
    if (options.startDate) {
      dataURL.searchParams.set("startDate", options.startDate);
    }
    if (options.endDate) {
      dataURL.searchParams.set("endDate", options.endDate);
    }
  }

  const response = await fetch(dataURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    const patientData = (await response.json()) as PatientData;
    return patientData;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * Get notes of a given patient
 * @param userId ID of the patient
 */
export async function getMessages(session: Session, patient: IUser, options?: GetPatientDataOptions): Promise<MessageNote[]> {
  const { sessionToken, traceToken } = session;
  const messagesURL = new URL(`/message/notes/${patient.userid}`, appConfig.API_HOST);

  if (options) {
    if (options.startDate) {
      messagesURL.searchParams.set("starttime", options.startDate);
    }
    if (options.endDate) {
      messagesURL.searchParams.set("endtime", options.endDate);
    }
  }

  const response = await fetch(messagesURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    const result = (await response.json()) as MessagesThread;
    if (Array.isArray(result.messages)) {
      return result.messages;
    }
    return [];
  } else if (response.status === HttpStatus.StatusNotFound) {
    // When the user has no message the api return a 404
    // We don't want to crash in that case
    return [];
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * Get all messages for the given message thread
 * @param messageId The root note id
 */
export async function getMessageThread(session: Session, messageId: string): Promise<MessageNote[]> {
  const { sessionToken, traceToken } = session;
  const messageURL = new URL(`/message/thread/${messageId}`, appConfig.API_HOST);
  const response = await fetch(messageURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    const out = (await response.json()) as MessagesThread | undefined;
    const messages: MessageNote[] = out?.messages ?? [];
    if (!Array.isArray(messages)) {
      log.error("Expected an array of messages", { messages });
      Promise.reject(new Error("Invalid response"));
    }
    // Sort messages, so they are displayed in the right order.
    const sortedMessages = _.sortBy(messages, (message: MessageNote) => Date.parse(message.timestamp));
    // const sortedMessages = _.sortBy(messages, (message: MessageNote) => {
    //   return _.isEmpty(message.parentmessage) ? -1 : Date.parse(message.timestamp);
    // });
    return sortedMessages;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * Create a new note
 * @param message The note to send
 */
export async function startMessageThread(session: Session, message: MessageNote): Promise<string> {
  const { sessionToken, traceToken } = session;
  const messageURL = new URL(`/message/send/${message.groupid}`, appConfig.API_HOST);
  const response = await fetch(messageURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({
      message: {
        ...message,
        guid: uuidv4(),
      },
    }),
  });

  if (response.ok) {
    const result = (await response.json()) as { id: string };
    return result.id;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * reply to a message thread
 * @param message The note to send
 * @returns The id of the new message
 */
export async function replyMessageThread(session: Session, message: MessageNote): Promise<string> {
  const { sessionToken, traceToken } = session;
  const messageURL = new URL(`/message/reply/${message.parentmessage}`, appConfig.API_HOST);
  const response = await fetch(messageURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({
      message: {
        ...message,
        guid: uuidv4(),
      },
    }),
  });

  if (response.ok) {
    const result = (await response.json()) as { id: string };
    return result.id;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * Edit a message
 * @param message The note to send
 */
export async function editMessage(session: Session, message: MessageNote): Promise<void> {
  const { sessionToken, traceToken } = session;
  const messageURL = new URL(`/message/edit/${message.id}`, appConfig.API_HOST);
  const response = await fetch(messageURL.toString(), {
    method: "PUT",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({ message }),
  });

  if (response.ok) {
    return Promise.resolve();
  }
  return Promise.reject(errorFromHttpStatus(response, log));
}
