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
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import AssignmentIcon from "@material-ui/icons/Assignment";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MedicalRecordList from "./medical-record-list";
import PrescriptionList from "./prescription-list";

const useStyle = makeStyles(() => ({
  cardContent: {
    maxHeight: 450,
    overflow: "auto",
  },
  medicalFilesWidget: {
    width: "400px",
    height: "fit-content",
  },
  medicalFilesWidgetHeader: {
    textTransform: "uppercase",
    backgroundColor: "var(--card-header-background-color)",
  },
}));

export interface MedicalFilesWidgetProps {
  patientId: string;
  teamId: string;
  userRole: string;
}

export default function MedicalFilesWidget(props: MedicalFilesWidgetProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = useStyle();

  return (
    <React.Fragment>
      <Card className={classes.medicalFilesWidget} id="medical-files-card">
        <CardHeader
          id="medical-files-card-header"
          avatar={<AssignmentIcon />}
          className={classes.medicalFilesWidgetHeader}
          title={`${t("medical-files")}`}
        />
        <CardContent className={classes.cardContent}>
          <PrescriptionList {...props} />
          <MedicalRecordList {...props} />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
