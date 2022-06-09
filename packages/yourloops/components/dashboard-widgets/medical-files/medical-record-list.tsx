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

import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import TrashCanOutlined from "../../icons/TrashCanOutlined";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { MedicalRecord } from "../../../lib/medical-files/model";
import MedicalFilesApi from "../../../lib/medical-files/medical-files-api";
import MedicalRecordEditDialog from "../../dialogs/medical-record-edit-dialog";
import MedicalRecordDeleteDialog from "../../dialogs/medical-record-delete-dialog";
import { CategoryProps } from "./medical-files-widget";

const useStyle = makeStyles((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600,
  },
  list: {
    maxHeight: 160,
    overflow: "auto",
  },
  hoveredItem: {
    "&:hover": {
      cursor: "pointer",
    },
    "&.selected": {
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

export default function MedicalRecordList(props: CategoryProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = useStyle();
  const { teamId, patientId } = props;
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [medicalRecordToEdit, setMedicalRecordToEdit] = useState<MedicalRecord | undefined>(undefined);
  const [medicalRecordToDelete, setMedicalRecordToDelete] = useState<MedicalRecord | undefined>(undefined);
  const [hoveredItem, setHoveredItem] = useState<string | undefined>(undefined);
  const [readonly, setReadonly] = useState<boolean>(false);

  const closeMedicalRecordEditDialog = () => {
    setHoveredItem(undefined);
    setIsEditDialogOpen(false);
    setMedicalRecordToEdit(undefined);
  };

  const closeMedicalRecordDeleteDialog = () => {
    setHoveredItem(undefined);
    setIsDeleteDialogOpen(false);
    setMedicalRecordToDelete(undefined);
  };

  const onEditMedicalRecord = (medicalRecord: MedicalRecord): void => {
    setMedicalRecordToEdit(medicalRecord);
    setReadonly(false);
    setIsEditDialogOpen(true);
  };

  const onDeleteMedicalRecord = (medicalRecord: MedicalRecord): void => {
    setMedicalRecordToDelete(medicalRecord);
    setIsDeleteDialogOpen(true);
  };

  const onClickMedicalRecord = (medicalRecord: MedicalRecord) => {
    setMedicalRecordToEdit(medicalRecord);
    setReadonly(true);
    setIsEditDialogOpen(true);
  };

  const updateMedicalRecordList = (payload: MedicalRecord) => {
    const index = medicalRecords.findIndex((mr) => mr.id === payload.id);
    if (index > -1) {
      medicalRecords.splice(index, 1, payload);
    } else {
      medicalRecords.push(payload);
    }
  };

  const removeMedicalRecordFromList = (medicalRecordId: string) => {
    const index = medicalRecords.findIndex((mr) => mr.id === medicalRecordId);
    medicalRecords.splice(index, 1);
  };

  useEffect(() => {
    (async () => {
      setMedicalRecords(await MedicalFilesApi.getMedicalRecords(patientId, teamId));
    })();
  }, [patientId, teamId]);

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t("medical-records")}
      </Typography>
      <List className={classes.list}>
        {medicalRecords.map((medicalRecord, index) => (
          <ListItem
            dense
            divider
            key={index}
            className={`${classes.hoveredItem} ${medicalRecord.id === hoveredItem ? "selected" : ""}`}
            onClick={() => onClickMedicalRecord(medicalRecord)}
            onMouseOver={() => setHoveredItem(medicalRecord.id)}
            onMouseOut={() => setHoveredItem(undefined)}
          >
            <ListItemIcon>
              <DescriptionOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              {t("medical-record-pdf")}{new Date(medicalRecord.creationDate).toLocaleDateString()}
            </ListItemText>
            {medicalRecord.id === hoveredItem &&
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
                    onClick={() => onDeleteMedicalRecord(medicalRecord)}
                  >
                    <TrashCanOutlined />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            }
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="end" marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          startIcon={<NoteAddIcon />}
          onClick={() => setIsEditDialogOpen(true)}
        >
          {t("new")}
        </Button>
      </Box>

      {isEditDialogOpen &&
        <MedicalRecordEditDialog
          {...props}
          medicalRecord={medicalRecordToEdit}
          readonly={readonly}
          onClose={closeMedicalRecordEditDialog}
          onSaved={updateMedicalRecordList}
        />
      }

      {isDeleteDialogOpen && medicalRecordToDelete &&
        <MedicalRecordDeleteDialog
          medicalRecord={medicalRecordToDelete}
          onClose={closeMedicalRecordDeleteDialog}
          onDelete={removeMedicalRecordFromList}
        />
      }
    </React.Fragment>
  );
}
