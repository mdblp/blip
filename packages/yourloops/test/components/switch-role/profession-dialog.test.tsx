/**
 * Copyright (c) 2022, Diabeloop
 * HCP patient list bar tests
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

import { expect } from "chai";
import { mount } from "enzyme";
import _ from "lodash";
import { HcpProfession } from "../../../models/hcp-profession";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as sinon from "sinon";

import { SwitchRoleProfessionDialogProps } from "../../../components/switch-role/models";
import SwitchRoleProfessionDialog from "../../../components/switch-role/profession-dialog";


function testRoleProfessionDialog(): void {

  const spyCancel = sinon.spy();
  const spyAccept = sinon.spy();

  const Dialog = (props: { content: SwitchRoleProfessionDialogProps }): JSX.Element => {
    return (
      <SwitchRoleProfessionDialog
        open={props.content.open}
        onAccept={props.content.onAccept}
        onCancel={props.content.onCancel}
      />
    );
  };

  describe("SwitchRoleProfessionDialog act", () => {
    let container: HTMLElement | null = null;

    async function mountComponent(onAccept = _.noop, onCancel = _.noop, open = true): Promise<void> {
      const props: SwitchRoleProfessionDialogProps = { onAccept, onCancel, open };
      await act(() => {
        return new Promise((resolve) => {
          render(
            <Dialog content={props} />, container, resolve);
        });
      });
    }

    before(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    after(() => {
      if (container) {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
      }
    });

    it("should not render when not opened", async () => {
      await mountComponent(spyAccept, spyCancel, false);
      const component = document.getElementById("switch-role-profession-dialog");
      expect(component).to.be.null;
    });

    it("should be able to render", async () => {
      await mountComponent(spyAccept, spyCancel, true);
      const component = document.getElementById("switch-role-profession-dialog");
      expect(component).to.be.not.null;
    });

    it("should call spyCancel on cancel button click", async () => {
      await mountComponent(spyAccept, spyCancel, true);
      const cancelButton: HTMLButtonElement = document.getElementById("switch-role-profession-dialog-button-decline") as HTMLButtonElement;
      cancelButton.click();
      expect(spyCancel.calledOnce).to.be.true;
    });
  });

  describe("SwitchRoleProfessionDialog mount", () => {

    const fakeDialog = (props: SwitchRoleProfessionDialogProps): JSX.Element => {
      return (
        <Dialog content={props} />
      );
    };

    it("should enable accept button when an option is selected", () => {
      const props: SwitchRoleProfessionDialogProps = { onAccept: spyAccept, onCancel: spyCancel, open: true };
      const wrapper = mount(fakeDialog(props));
      expect(wrapper.find("button#switch-role-profession-dialog-button-validate").prop("disabled")).to.be.true;
      wrapper.find("input.MuiSelect-nativeInput").simulate("change", { target: { name: "profile-hcp-profession", value: HcpProfession.diabeto } });
      expect(wrapper.find("button#switch-role-profession-dialog-button-validate").prop("disabled")).to.be.false;
      wrapper.find("button#switch-role-profession-dialog-button-validate").simulate("click");
      expect(spyAccept.calledOnce).to.be.true;
      wrapper.unmount();
    });
  });
}

export default testRoleProfessionDialog;
