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
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MedicalFilesApi from "../../../../lib/medical-files/medical-files-api";
import { WeeklyReport } from "../../../../lib/medical-files/model";
import * as authHookMock from "../../../../lib/auth";
import User from "../../../../lib/auth/user";
import { Alarm } from "../../../../models/alarm";
import WeeklyReportList from "../../../../components/dashboard-widgets/medical-files/weekly-report-list";
import { WeeklyReportDialogProps } from "../../../../components/dialogs/weekly-report-dialog";

jest.mock("../../../../lib/auth");
// eslint-disable-next-line react/display-name
jest.mock("../../../../components/dialogs/weekly-report-dialog", () => (props: WeeklyReportDialogProps) => {
  return (
    <div aria-label="mock-dialog">
      <button onClick={() => props.onClose()}>mock-close-button</button>
    </div>
  );
});
describe("Weekly report list", () => {
  const weeklyReport = {
    id: "fakeId",
    patientId: "patientId",
    teamId: "teamId",
    parameters: {},
    alarms: {} as Alarm,
    creationDate: "2022-02-02",
  } as WeeklyReport;

  const getWeeklyReportsSpy = () => {
    return jest.spyOn(MedicalFilesApi, "getWeeklyReports").mockResolvedValue([weeklyReport]);
  };

  async function renderComponent() {
    render(<WeeklyReportList teamId="teamId" patientId="patientId" />);
    await waitFor(() => expect(getWeeklyReportsSpy()).toHaveBeenCalled());
  }

  beforeEach(() => {
    getWeeklyReportsSpy();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } as User };
    });
  });

  it("should render an empty list if no weekly report exist", async () => {
    getWeeklyReportsSpy().mockResolvedValueOnce([]);
    await renderComponent();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("should render a list if some weekly reports exists", async () => {
    await renderComponent();
    expect(screen.queryAllByRole("listitem")).toHaveLength(1);
  });

  it("should open modal when clicking on a list item", async () => {
    await renderComponent();
    const listItem = screen.getByRole("listitem", { name: "weekly-report-fakeId" });
    fireEvent.click(listItem);
    expect(screen.queryByLabelText("mock-dialog")).not.toBeNull();
  });

  it("should close modal when clicking on close button", async () => {
    await renderComponent();
    const listItem = screen.getByRole("listitem", { name: "weekly-report-fakeId" });
    fireEvent.click(listItem);
    fireEvent.click(screen.getByRole("button", { name: "mock-close-button" }));
    expect(screen.queryByLabelText("mock-dialog")).toBeNull();
  });
});
