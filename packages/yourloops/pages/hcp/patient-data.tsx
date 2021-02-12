/**
 * Copyright (c) 2021, Diabeloop
 * HCPs patient data page
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

import * as React from "react";
import bows from "bows";
import Container from "@material-ui/core/Container";

import Blip from "blip";

import { UserRoles } from "models/shoreline";
import appConfig from "../../lib/config";
import apiClient from "../../lib/auth/api";
import { useTeam } from "../../lib/team";

interface PatientDataProps {
  patientId?: string;
}

interface PatientDataPageErrorProps {
  msg: string;
}

const log = bows("PatientDataPage");

function PatientDataPageError({ msg }: PatientDataPageErrorProps): JSX.Element {
  return (
    <Container maxWidth="lg">
      <strong>{msg}</strong>
    </Container>
  );
}

function PatientDataPage(props: PatientDataProps): JSX.Element {
  const { patientId } = props;

  const [error, setError] = React.useState<string | null>(null);
  const teamHook = useTeam();

  if (typeof patientId === "undefined") {
    return <PatientDataPageError msg="Invalid patient" />;
  }

  const user = teamHook.getUser(patientId);
  if (user === null || !user.roles?.includes(UserRoles.patient)) {
    return <PatientDataPageError msg="Invalid patient" />;
  }

  apiClient.loadPatientData(user).catch((reason: unknown) => {
    log.error("loadPatientData", reason);
    setError("Doesn't compute");
  });

  if (error !== null) {
    return <PatientDataPageError msg={error} />;
  }

  return (
    <Container maxWidth="lg">
      <Blip config={appConfig} api={apiClient} />
    </Container>
  );
}

export default PatientDataPage;
