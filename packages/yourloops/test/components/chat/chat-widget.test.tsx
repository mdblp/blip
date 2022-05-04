/**
 * Copyright (c) 2022, Diabeloop
 * Chat widget tests
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

import React from "react";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { loggedInUsers } from "../../common";
import ChatWidget from "../../../components/chat/chat-widget";
import { act, Simulate } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import * as chatAPI from "../../../lib/chat/api";
import { text } from "body-parser";

describe("Chat widget", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authPatient = loggedInUsers.patientSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const authHookPatient: AuthContext = createAuthHookStubs(authPatient);

  let container: HTMLElement | null = null;

  async function mountComponent(authContext: AuthContext): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <AuthContextProvider value={authContext}>
            <ChatWidget teamId="777" patientId={"132"} userRole={"patient"} userId={"254"} />
          </AuthContextProvider>, container, resolve);
      });
    });
  }

  beforeAll(()=>{
    Element.prototype.scroll = jest.fn();
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  function expectBaseState() {
    const sendButton = container.querySelector("#chat-widget-send-button");
    expect(sendButton).toBeDefined();
    expect(sendButton.getAttribute("disabled")).toBeDefined();
    const textInput = container.querySelector("#standard-multiline-flexible");
    expect(textInput).toBeDefined();
    expect(textInput.innerHTML.length).toEqual(0);
    const emojiPicker = container.querySelector("#chat-widget-emoji-picker");
    expect(emojiPicker).toBeNull();
  }

  it("should render an empty chat widget when no messages for HCP", async () => {
    const apiStub = jest.spyOn(chatAPI, "getChatMessages").mockResolvedValue(Promise.resolve([]));
    await mountComponent(authHookHcp);
    expect(apiStub).toHaveBeenCalled();
    expectBaseState();
  });

  it("should render an empty chat widget when no messages for patient", async () => {
    const apiStub = jest.spyOn(chatAPI, "getChatMessages").mockResolvedValue(Promise.resolve([]));
    await mountComponent(authHookPatient);
    expect(apiStub).toHaveBeenCalled();
    expectBaseState();
  });

  it("should display messages", async () => {
    const patient = authPatient.user;
    const mockedMessages = [{
      id: "123456",
      patientId: patient.userid,
      teamId: "team1",
      authorId: patient.userid,
      destAck: false,
      text: "Hello HCPs",
      timezone: "UTC",
      timestamp: Date.now().toString(),
      user: patient,
    }];
    const apiStub = jest.spyOn(chatAPI, "getChatMessages").mockResolvedValue(Promise.resolve(mockedMessages));
    await mountComponent(authHookPatient);
    expect(apiStub).toHaveBeenCalled();
    const messages = container.querySelectorAll(".message");
    expect(messages.length).toEqual(mockedMessages.length);
  });

  it("should render an emoji picker when clicking on the emoji button and add the clicked emoji in the text input before disappearing", async () => {
    const apiStub = jest.spyOn(chatAPI, "getChatMessages").mockResolvedValue(Promise.resolve([]));
    await mountComponent(authHookPatient);
    expect(apiStub).toHaveBeenCalled();

    //when clicking on the emoji button
    const emojiButton = container.querySelector("#chat-widget-emoji-button");
    expect(emojiButton).toBeDefined();
    Simulate.click(emojiButton);
    let emojiPicker = container.querySelector("#chat-widget-emoji-picker");
    expect(emojiPicker).toBeDefined();

    //when clicking on an emoji
    const emojiItem = emojiPicker.querySelector(".emoji");
    expect(emojiItem).toBeDefined();
    Simulate.click(emojiItem.querySelector("button"));
    emojiPicker = container.querySelector("#chat-widget-emoji-picker");
    expect(emojiPicker).toBeNull();

    const textInput = container.querySelector("#standard-multiline-flexible");
    expect(textInput.innerHTML.length).toBeGreaterThanOrEqual(1);
  });

  it("should send the message when clicking on send button", async () => {
    jest.spyOn(chatAPI, "getChatMessages").mockResolvedValue(Promise.resolve([]));
    await mountComponent(authHookPatient);

    const textInput = container.querySelector("#standard-multiline-flexible") as HTMLTextAreaElement;
    expect(textInput).toBeDefined();
    textInput.innerHTML = "Hello";
    Simulate.change(textInput);

    const apiStubSendMessage = jest.spyOn(chatAPI, "sendChatMessage").mockResolvedValue(true);
    const sendButton = container.querySelector("#chat-widget-send-button");
    expect(sendButton).toBeDefined();
    expect(sendButton.getAttribute("disabled")).toBeNull();
    Simulate.click(sendButton);
    expect(apiStubSendMessage).toHaveBeenCalled();
  });
});
