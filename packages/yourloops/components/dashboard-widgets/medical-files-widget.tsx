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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";

import AssignmentIcon from "@material-ui/icons/Assignment";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import FileChartOutlinedIcon from "../icons/FileChartOutlinedIcon";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import TrashCanOutlined from "../icons/TrashCanOutlined";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { Prescription, MedicalRecord } from "../../lib/medical-files/model";
import MedicalFilesApi from "../../lib/medical-files/medical-files-api";
import MedicalRecordEditDialog from "../dialogs/medical-record-edit-dialog";

const useStyle = makeStyles((theme: Theme) => {
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
    medicalRecordItem: {
      "&:hover": {
        cursor: "pointer",
      },
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
});

export interface MedicalFilesWidgetProps {
  patientId: string;
  teamId: string;
  userRole: string;
}

function MedicalFilesWidget(props: MedicalFilesWidgetProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = useStyle();
  const { patientId, teamId } = props;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | undefined>(undefined);
  const [hoveredMedicalRecord, setHoveredMedicalRecord] = useState<number | undefined>(undefined);

  const onCloseMedicalRecordEditDialog = () => {
    setHoveredMedicalRecord(undefined);
    setIsEditDialogOpen(false);
    setSelectedMedicalRecord(undefined);
  };

  const onEditMedicalRecord = (medicalRecord: MedicalRecord): void => {
    setSelectedMedicalRecord(medicalRecord);
    setIsEditDialogOpen(true);
  };

  const onClickMedicalRecord = (medicalRecord: MedicalRecord) => {
    // TODO add PDF generation
    console.log(`click medical record ${medicalRecord.id}`);
  };

  const onDeleteMedicalRecord = (id: number): void => {
    // TODO add a modal to delete medical record
    console.log(`delete medical record ${id}`);
  };

  useEffect(() => {
    (async () => {
      setPrescriptions(await MedicalFilesApi.getPrescriptions(patientId, teamId));
      setMedicalRecords(await MedicalFilesApi.getMedicalRecords(patientId, teamId));
    })();
  }, [patientId, teamId]);

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
          <Box className={classes.categoryContainer}>
            <Typography className={classes.categoryTitle}>
              {t("prescriptions")}
            </Typography>
            <List className={classes.list}>
              {prescriptions.map((prescription, index) => (
                <ListItem
                  dense
                  divider
                  key={index}
                >
                  <ListItemIcon>
                    <FileChartOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t("prescription-pdf")}{prescription.uploadedAt.toLocaleDateString()}
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
              {medicalRecords.map((medicalRecord, index) => (
                <ListItem
                  dense
                  divider
                  key={index}
                  className={classes.medicalRecordItem}
                  onClick={() => onClickMedicalRecord(medicalRecord)}
                  onMouseOver={() => setHoveredMedicalRecord(medicalRecord.id)}
                  onMouseOut={() => setHoveredMedicalRecord(undefined)}
                >
                  <ListItemIcon>
                    <DescriptionOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t("medical-record-pdf")}{medicalRecord.creationDate.toLocaleDateString()}
                  </ListItemText>
                  {medicalRecord.id === hoveredMedicalRecord &&
                    <ListItemSecondaryAction>
                      <Tooltip title={t("edit") as string}>
                        <IconButton
                          edge="end"
                          size="small"
                          disableRipple
                          disableFocusRipple
                          onClick={() => onEditMedicalRecord(medicalRecord)}
                        >
                          <CreateOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("delete") as string}>
                        <IconButton
                          edge="end"
                          size="small"
                          disableRipple
                          disableFocusRipple
                          onClick={() => onDeleteMedicalRecord(medicalRecord.id)}
                        >
                          <TrashCanOutlined />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  }
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
            onClick={() => setIsEditDialogOpen(true)}
          >
            {t("new")}
          </Button>
        </CardActions>
      </Card>
      {isEditDialogOpen &&
        <MedicalRecordEditDialog
          onClose={onCloseMedicalRecordEditDialog}
          medicalRecord={selectedMedicalRecord}
        />
      }
    </React.Fragment>
  );
}

export default MedicalFilesWidget;
