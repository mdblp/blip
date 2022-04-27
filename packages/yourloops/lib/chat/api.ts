/**
 * Copyright (c) 2022, Diabeloop
 * Chat system - API calls
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

import bows from "bows";

import { HttpHeaderKeys } from "../../models/api";
import { errorFromHttpStatus } from "../../lib/utils";
import { Session } from "../auth";
import appConfig from "../config";
import { IMessage } from "../../models/chat";

const log = bows("ChatAPI");

export async function getChatMessages(session: Session, teamId: string, patientId: string): Promise<IMessage[]> {
  const { sessionToken, traceToken } = session;
  log.info("getMessages()");

  const apiURL = new URL(`chat/v1/messages/teams/${teamId}/patients/${patientId}`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    return response.json() as Promise<IMessage[]>;
  }
  return Promise.reject(errorFromHttpStatus(response, log));
}

export async function sendChatMessage(session: Session, teamId: string, patientId: string, text: string): Promise<void> {
  const { sessionToken, traceToken } = session;
  log.info("getMessages()");

  const apiURL = new URL(`chat/v1/messages/teams/${teamId}/patients/${patientId}`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({ text }),
  });

  if (response.ok) {
    return response.json() as Promise<void>;
  }
  return Promise.reject(errorFromHttpStatus(response, log));
}

export default {
  getChatMessages,
  sendChatMessage,
};
