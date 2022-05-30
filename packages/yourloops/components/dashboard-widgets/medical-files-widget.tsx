/**
 * Copyright (c) 2022, Diabeloop
 * Generic Chat window
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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";

import AssignmentIcon from "@material-ui/icons/Assignment";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import { Prescription, WeeklyReport, MedicalRecord } from "../../lib/medical-files/model";
import MedicalFilesApi from "../../lib/medical-files/medical-files-api";
import FileChartOutlinedIcon from "../icons/FileChartOutlinedIcon";

const medicalFilestStyles = makeStyles((theme: Theme) => {
  return {
    cardActions: {
      justifyContent: "end",
      paddingTop: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    cardContent: {
      maxHeight: 450,
      overflow: "auto",
    },
    categoryTitle: {
      fontWeight: 600,
    },
    categoryContainer: {
      marginBottom: theme.spacing(2),
    },
    list: {
      maxHeight: 160,
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
    test: {
      padding: theme.spacing(1),
    },
  };
}, { name: "ylp-medical-files-card" });

export interface MedicalFilesWidgetProps {
  patientId: string;
  teamId: string;
  userRole: string;
}

function MedicalFilesWidget(props: MedicalFilesWidgetProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = medicalFilestStyles();
  const { patientId, teamId } = props;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    (async () => {
      setPrescriptions(await MedicalFilesApi.getPrescriptions(patientId, teamId));
      setWeeklyReports(await MedicalFilesApi.getWeeklyReports(patientId, teamId));
      setMedicalRecords(await MedicalFilesApi.getMedicalRecords(patientId, teamId));
    })();
  }, [patientId, teamId]);
  //
  // // TODO: is it relevent to make it generics =>  onDownload<T> = async (file: T): Promise<void> ?
  // const onPrescriptionDownload = async (file: Prescrition): Promise<void> => {
  //   // api call
  //   try {
  //     const result = await getPrescription(file.id);
  //     const url = window.URL.createObjectURL(new Blob([result]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", file.name); //or any other extension
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     log.error(error);
  //   }
  //   return Promise.resolve();
  // };

  return (
    <Card className={classes.medicalFilesWidget} id="medical-files-card">
      <CardHeader
        id="medical-files-card-header"
        avatar={<AssignmentIcon />}
        className={classes.medicalFilesWidgetHeader}
        title={`${t("medical-files")}`}
      />
      <CardContent className={classes.cardContent}>
        <Box className={classes.categoryContainer}>
          <Typography className={classes.categoryTitle}>
            {t("prescriptions")}
          </Typography>
          <List className={classes.list}>
            {prescriptions.map((file, index) => (
              <ListItem
                dense
                divider
                key={index}
              >
                <ListItemIcon>
                  <DescriptionOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  {file.name}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box className={classes.categoryContainer}>
          <Typography className={classes.categoryTitle}>
            {t("weekly-reports")}
          </Typography>
          <List className={classes.list}>
            {weeklyReports.map((file, index) => (
              <ListItem
                dense
                divider
                key={index}
              >
                <ListItemIcon>
                  <FileChartOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  {file.name}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box className={classes.categoryContainer}>
          <Typography className={classes.categoryTitle}>
            {t("medical-records")}
          </Typography>
          <List className={classes.list}>
            {medicalRecords.map((file, index) => (
              <ListItem
                dense
                divider
                key={index}
              >
                <ListItemIcon>
                  <DescriptionOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  {file.name}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          startIcon={<NoteAddIcon />}
        >
          {t("new")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default MedicalFilesWidget;
