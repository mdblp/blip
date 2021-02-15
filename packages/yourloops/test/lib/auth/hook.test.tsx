/**
 * Copyright (c) 2021, Diabeloop
 * Auth hook tests
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

import sinon from "sinon";
import { v4 as uuidv4 } from "uuid";

import { AuthContext } from "../../../lib/auth";
import { loggedInUsers } from "../../common";

export const authHook = {
  user: loggedInUsers.hcp,
  sessionToken: "",
  traceToken: uuidv4(),
  initialized: sinon.stub().returns(true),
  setUser: sinon.spy(),
  login: sinon.stub().resolves(loggedInUsers.hcp),
  logout: sinon.spy(),
  updateProfile: sinon.stub().resolves(loggedInUsers.hcp.profile),
  updatePreferences: sinon.stub().resolves(loggedInUsers.hcp.profile),
  updateSettings: sinon.stub().resolves(loggedInUsers.hcp.profile),
  signup: sinon.spy(),
  isLoggedIn: sinon.stub().returns(true),
  sendPasswordResetEmail: sinon.stub().returns(true),
  flagPatient: sinon.stub().resolves(),
  setFlagPatients: sinon.stub().resolves(),
  getFlagPatients: sinon.stub().returns([]),
};

export function TestAuthProviderHCP(): AuthContext {
  return authHook;
}
