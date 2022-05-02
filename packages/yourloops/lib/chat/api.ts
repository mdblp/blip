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
import { IMessage } from "../../models/chat";
import HttpService from "../../services/http";

const log = bows("ChatAPI");

export async function getChatMessages(teamId: string, patientId: string): Promise<IMessage[]> {
  log.info("getMessages()");

  const url = `chat/v1/messages/teams/${teamId}/patients/${patientId}`;
  const response = await HttpService.get<IMessage[]>({
    url,
  });

  if (response.status === 200) {
    return response.data;
  }
  return Promise.reject(response.statusText);
}

export async function sendChatMessage(teamId: string, patientId: string, text: string): Promise<boolean> {
  log.info("getMessages()");
  const url = `chat/v1/messages/teams/${teamId}/patients/${patientId}`;
  const response = await HttpService.post<boolean, string>({
    url,
    payload: JSON.stringify({ text }) ,
  });

  if (response.status !== 200) {
    return Promise.reject(response.statusText);
  }
  return true;
}

export default {
  getChatMessages,
  sendChatMessage,
};
