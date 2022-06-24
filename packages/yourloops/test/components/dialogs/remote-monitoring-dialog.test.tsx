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

import * as teamHookMock from "../../../lib/team";
import * as notificationsHookMock from "../../../lib/notifications/hook";
import * as alertHookMock from "../../../components/utils/snackbar";
import RemoteMonitoringPatientDialog, {
  RemoteMonitoringDialogAction,
  RemoteMonitoringPatientDialogProps,
} from "../../../components/dialogs/remote-monitoring-dialog";
import { createPatient } from "../../common/utils";
import { PatientInfoProps, PrescriptionInfo } from "../../../components/patient/patient-monitoring-prescription";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PatientTeam } from "../../../lib/data/patient";
import MedicalFilesApi from "../../../lib/medical-files/medical-files-api";
import { Prescription } from "../../../lib/medical-files/model";


const mockCorrectPrescription: PrescriptionInfo = {
  teamId: "fakeTeamId",
  memberId: "fakeMemberId",
  file: {} as File,
  numberOfMonth: 1,
};

// eslint-disable-next-line react/display-name
jest.mock("../../../components/patient/patient-monitoring-prescription", () => (props: PatientInfoProps) => {
  return <button onClick={() => props.setPrescriptionInfo(mockCorrectPrescription)}>set-correct-prescription</button>;
});
jest.mock("../../../components/utils/snackbar");
jest.mock("../../../lib/team");
jest.mock("../../../lib/notifications/hook");
describe("RemoteMonitoringPatientDialog", () => {
  const getPatientRemoteMonitoringTeamMock = jest.fn().mockReturnValue({ teamId: "fakeTeamId" } as PatientTeam);
  const inviteRemoteMonitoringMock = jest.fn();
  const editPatientRemoteMonitoringMock = jest.fn();
  const updatePatientMonitoringMock = jest.fn();
  const errorMock = jest.fn();
  const onClose = jest.fn();
  const patient = createPatient();
  const renewProps = {
    patient,
    action: RemoteMonitoringDialogAction.renew,
    onClose,
  };

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        editPatientRemoteMonitoring: editPatientRemoteMonitoringMock,
        getPatientRemoteMonitoringTeam: getPatientRemoteMonitoringTeamMock,
        updatePatientMonitoring: updatePatientMonitoringMock,
      };
    });
    (alertHookMock.SnackbarContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { error: errorMock };
    });
    (notificationsHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (notificationsHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return { inviteRemoteMonitoring: inviteRemoteMonitoringMock };
    });
  });

  function getRemoteMonitoringPatientDialogJSX(props: RemoteMonitoringPatientDialogProps = {
    patient,
    action: RemoteMonitoringDialogAction.invite,
    onClose,
  }) {
    return <RemoteMonitoringPatientDialog {...props} />;
  }

  it("should enabled save button only when prescription fields are filled", async () => {
    render(getRemoteMonitoringPatientDialogJSX());
    const saveButton: HTMLButtonElement = screen.getByRole("button", { name: "button-save" });
    fireEvent.click(screen.getByRole("button", { name: "set-correct-prescription" }));
    await waitFor(() => expect(saveButton.disabled).toBeFalsy());
  });

  function setPrescriptionAndSave(props: RemoteMonitoringPatientDialogProps = {
    patient,
    action: RemoteMonitoringDialogAction.invite,
    onClose,
  }) {
    render(getRemoteMonitoringPatientDialogJSX(props));
    fireEvent.click(screen.getByRole("button", { name: "set-correct-prescription" }));
    const saveButton: HTMLButtonElement = screen.getByRole("button", { name: "button-save" });
    fireEvent.click(screen.getByRole("button", { name: "button-save" }));
    expect(saveButton.disabled).toBeTruthy();
  }

  function checkFunctionCalledOnSaveError() {
    expect(onClose).not.toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith("error-http-500");
    expect(((screen.getByRole("button", { name: "button-save" })) as HTMLButtonElement).disabled).toBeFalsy();
  }

  it("clicking on save should invite patient to remote monitoring", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockResolvedValue({} as Prescription);
    setPrescriptionAndSave();
    expect(inviteRemoteMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("clicking on save should show error when invitation failed to be created", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockResolvedValue({} as Prescription);
    inviteRemoteMonitoringMock.mockRejectedValueOnce(Error("This error was thrown by a mock on purpose"));
    setPrescriptionAndSave();
    expect(inviteRemoteMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).not.toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).not.toHaveBeenCalled();
    checkFunctionCalledOnSaveError();
  });

  it("clicking on save should show error when patient monitoring information could not be edited", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockRejectedValueOnce(Error("This error was thrown by a mock on purpose"));
    setPrescriptionAndSave();
    expect(inviteRemoteMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).toHaveBeenCalled();
    checkFunctionCalledOnSaveError();
  });

  it("clicking on save should renew patient remote monitoring invitation", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockResolvedValue({} as Prescription);
    setPrescriptionAndSave(renewProps);
    expect(updatePatientMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("clicking on save should show error when renew invitation failed to be created", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockResolvedValue({} as Prescription);
    updatePatientMonitoringMock.mockRejectedValueOnce(Error("This error was thrown by a mock on purpose"));
    setPrescriptionAndSave(renewProps);
    expect(updatePatientMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).not.toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).not.toHaveBeenCalled();
    checkFunctionCalledOnSaveError();
  });

  it("clicking on save should show error when patient monitoring information could not be edited in cas of a renewal", async () => {
    jest.spyOn(MedicalFilesApi, "uploadPrescription").mockRejectedValueOnce(Error("This error was thrown by a mock on purpose"));
    setPrescriptionAndSave(renewProps);
    expect(updatePatientMonitoringMock).toHaveBeenCalled();
    await waitFor(() => expect(editPatientRemoteMonitoringMock).toHaveBeenCalled());
    expect(MedicalFilesApi.uploadPrescription).toHaveBeenCalled();
    checkFunctionCalledOnSaveError();
  });
});

