/**
 * Copyright (c) 2021, Diabeloop
 * Patient list table for HCPs
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import BasicDropdown from "../dropdown/basic-dropdown";
import { Team, TeamMember, useTeam } from "../../lib/team";
import { UserRoles } from "../../models/shoreline";

const useStyles = makeStyles((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
  dropdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  fileTextField: {
    marginRight: theme.spacing(2),
    width: 240,
  },
  fileTextFieldOutlined: {
    fontSize: 13,
    color: "var(--text-base-color)",
  },
  input: {
    display: "none",
  },
  label: {
    fontWeight: 600,
    fontSize: "13px",
    width: "180px",
  },
  subCategoryTitle: {
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  title: {
    alignSelf: "center",
  },
  valueSelection: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: theme.spacing(3),
  },
}));

export interface PrescriptionInfo {
  teamId?: string,
  memberId?: string,
  file?: File,
  numberOfMonth: number,
}

export interface PatientInfoProps {
  setPrescriptionInfo: (prescriptionInfo: PrescriptionInfo) => void;
}

function PatientMonitoringPrescription(props: PatientInfoProps): JSX.Element {
  const { setPrescriptionInfo } = props;
  const classes = useStyles();
  const { t } = useTranslation("yourloops");
  const teamHook = useTeam();
  const month = t("month").toLowerCase();
  const monthValues = [...new Array(6)]
    .map((_each, index) => `${index + 1} ${month}`);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [membersName, setMembersName] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [prescription, setPrescription] = useState<File | undefined>(undefined);
  const [numberOfMonthSelected, setNumberOfMonthSelected] = useState(3);

  const teams = useMemo<Team[]>(() => teamHook.getRemoteMonitoringTeams(), [teamHook]);

  useEffect(() => {
    console.log("updatePrescriptionInfo");
    const prescriptionInfo: PrescriptionInfo = {
      teamId: selectedTeam?.id,
      memberId: selectedMember?.user.userid,
      file: prescription,
      numberOfMonth: numberOfMonthSelected,
    };
    setPrescriptionInfo(prescriptionInfo);
  }, [selectedMember, selectedTeam, prescription, numberOfMonthSelected, setPrescriptionInfo]);


  const selectMember = useCallback((memberName: string) => {
    const member = selectedTeam?.members.find(member => member.user.profile?.fullName === memberName);
    if (!member) {
      throw new Error(`The selected member with the name ${memberName} does not exists`);
    }
    setSelectedMember(member);
  }, [selectedTeam?.members]);

  const selectTeam = useCallback((teamName: string) => {
    const team = teams.find(team => team.name === teamName);
    if (!team) {
      throw new Error(`The selected team with the name ${teamName} does not exists`);
    }
    setSelectedTeam(team);
    const members = team.members
      .filter(member => member.user.profile?.fullName && (member.user.role === UserRoles.hcp || member.user.role === UserRoles.caregiver))
      .map(member => member.user.profile?.fullName) as string[];
    setMembersName(members);
  }, [teams]);

  useEffect(() => {
    if (!selectedTeam && teams.length > 0) {
      selectTeam(teams[0].name);
    }
    if (!selectedMember && membersName.length > 0) {
      selectMember(membersName[0]);
    }
  }, [membersName, selectMember, selectTeam, selectedMember, selectedTeam, teams]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPrescription(file);
    }
  };

  const onMonthDropdownSelect = (value: string) => {
    setNumberOfMonthSelected(+value.charAt(0));
  };

  return (
    <>
      <Typography className={classes.categoryTitle}>
        2. {t("prescription")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>A. {t("choice-of-remote-monitoring-team")}:</Typography>
          <Box className={classes.valueSelection}>
            <Typography>{t("requesting-team")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue={teams[0]?.name ?? ""}
                values={teams.map(team => team.name)}
                onSelect={selectTeam}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>B. {t("choice-of-healthcare-professional")}:</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("requesting-team-member")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-member-basic-dropdown"}
                defaultValue={membersName[0] ?? ""}
                values={membersName}
                onSelect={selectMember}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>
            C. {t("upload-prescription")}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("prescription")}:</Typography>
            <Box display="flex">
              <TextField
                variant="outlined"
                size="small"
                classes={{ root: classes.fileTextField }}
                InputProps={{
                  classes: {
                    root: classes.fileTextFieldOutlined,
                    disabled: classes.fileTextFieldOutlined,
                  },
                }}
                value={prescription?.name ?? t("file-uploaded-pdf-jpeg-png")}
                disabled
              />
              <input
                id="upload-file-input-id"
                accept="image/*,application/pdf"
                className={classes.input}
                onChange={handleFileSelected}
                type="file"
              />
              <label htmlFor="upload-file-input-id">
                <Button variant="contained" color="primary" component="span">
                  {t("browse")}
                </Button>
              </label>
            </Box>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>
            D. {t("prescription-duration")}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("remote-monitoring-prescription-duration")}:</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue={`${numberOfMonthSelected} ${month}`}
                values={monthValues}
                onSelect={onMonthDropdownSelect}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default PatientMonitoringPrescription;
