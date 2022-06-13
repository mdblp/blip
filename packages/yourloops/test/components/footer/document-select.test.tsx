/**
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

import React from "react";
import i18n from "i18next";
import renderer from "react-test-renderer";

import DocumentSelect, {
  ACCOMPANYING_DOCUMENTS,
  DocumentSelectProps,
  INTENDED_USE,
  TRAINING,
} from "../../../components/footer/document-select";
import diabeloopUrls from "../../../lib/diabeloop-url";
import { UserRoles } from "../../../models/shoreline";
import User from "../../../lib/auth/user";

describe("DocumentSelect", () => {
  const windowOpenSpy = jest.fn();
  window.open = windowOpenSpy;

  function renderDocumentSelect(props: DocumentSelectProps) {
    return renderer.create(
      <DocumentSelect user={props.user} />
    );
  }

  it("should display and disable correct values", () => {
    const component = renderDocumentSelect({ user: null });
    const select = component.root.findByProps({ id: "document-selector" }).props.children;
    expect(select.find((element: { key: string; }) => element.key === ACCOMPANYING_DOCUMENTS).props.disabled).toBeTruthy();
    expect(select.find((element: { key: string; }) => element.key === INTENDED_USE).props.disabled).toBeFalsy();
    expect(select.find((element: { key: string; }) => element.key === TRAINING).props.disabled).toBeFalsy();
  });

  it("should open url for intend use pdf", () => {
    const component = renderDocumentSelect({ user: null });
    component.root.findByProps({ id: "document-selector" }).props.onChange({ target: { value: INTENDED_USE } });
    expect(window.open).toHaveBeenCalledWith(diabeloopUrls.getIntendedUseUrL(i18n.language));
  });

  it("should open url for login training pdf when no user is given", () => {
    const component = renderDocumentSelect({ user: null });
    component.root.findByProps({ id: "document-selector" }).props.onChange({ target: { value: TRAINING } });
    expect(window.open).toHaveBeenCalledWith(`https://example.com/yourloops-login-training.${i18n.language}.pdf`);
  });

  it("should open url for patient training pdf when user is patient", () => {
    const component = renderDocumentSelect({ user: { role: UserRoles.patient } as User });
    component.root.findByProps({ id: "document-selector" }).props.onChange({ target: { value: TRAINING } });
    expect(window.open).toHaveBeenCalledWith(`https://example.com/yourloops-patient-training.${i18n.language}.pdf`);
  });

  it("should open url for caregiver training pdf when user is caregiver", () => {
    const component = renderDocumentSelect({ user: { role: UserRoles.caregiver } as User });
    component.root.findByProps({ id: "document-selector" }).props.onChange({ target: { value: TRAINING } });
    expect(window.open).toHaveBeenCalledWith(`https://example.com/yourloops-caregiver-training.${i18n.language}.pdf`);
  });

  it("should open url for hcp training pdf when user is hcp", () => {
    const component = renderDocumentSelect({ user: { role: UserRoles.hcp } as User });
    component.root.findByProps({ id: "document-selector" }).props.onChange({ target: { value: TRAINING } });
    expect(window.open).toHaveBeenCalledWith(`https://example.com/yourloops-hcp-training.${i18n.language}.pdf`);
  });
});

