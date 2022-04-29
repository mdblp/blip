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
import renderer from "react-test-renderer";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { TeamContextProvider } from "../../../lib/team";
import { teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { loggedInUsers } from "../../common";
import ChatWidget from "../../../components/chat/chat-widget";
import { stubNotificationContextValue } from "../../lib/notifications/utils";
import { NotificationContextProvider } from "../../../lib/notifications";

describe("Chat widget", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authPatient = loggedInUsers.patientSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const authHookPatient: AuthContext = createAuthHookStubs(authPatient);
  console.log(authHookPatient);

  // let container: HTMLElement | null = null;

  // async function mountComponent(authContext: AuthContext): Promise<void> {
  //   await act(() => {
  //     return new Promise((resolve) => {
  //       render(
  //         <AuthContextProvider value={authContext}>
  //           <ChatWidget teamId={"222"} patientId={"132"} userRole={"patient"} userId={"254"}/>
  //         </AuthContextProvider>, container, resolve);
  //     });
  //   });
  // }
  //
  // beforeEach(() => {
  //   container = document.createElement("div");
  //   document.body.appendChild(container);
  // });
  //
  // afterEach(() => {
  //   if (container) {
  //     unmountComponentAtNode(container);
  //     container.remove();
  //     container = null;
  //   }
  // });

  function renderChatWidget(authContext: AuthContext) {
    return renderer.create(
      <AuthContextProvider value={authContext}>
        <NotificationContextProvider value={stubNotificationContextValue}>
          <TeamContextProvider teamAPI={teamAPI}>
            <ChatWidget teamId="777" patientId={"132"} userRole={"patient"} userId={"254"}/>
          </TeamContextProvider>
        </NotificationContextProvider>
      </AuthContextProvider>
    );
  }

  // it("should render an empty chat widget when no messages for HCP", async () => {
  //   await mountComponent(authHookHcp);
  //   // await new Promise((r) => setTimeout(r, 2000));
  //   const chatContent = container.querySelector("#chatWidgetContent");
  //   expect(chatContent).toBeDefined();
  // });

  // it("should render an empty chat widget when no messages for patient", () => {
  //   const component = renderChatWidget(authHookPatient);
  //   const chatWidget = component.root.findByType(ChatWidget);
  //   expect(chatWidget).toBeDefined();
  // });

  it("should render an empty chat widget when no messages for patient", () => {
    const component = renderChatWidget(authHookPatient);
    const chatWidget = component.root.findByType(ChatWidget);
    expect(chatWidget).toBeDefined();
  });

  it("should render an empty chat widget when no messages for hcp", () => {
    const component = renderChatWidget(authHookHcp);
    const chatWidget = component.root.findByType(ChatWidget);
    expect(chatWidget).toBeDefined();
  });
});

