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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TuneIcon from "@material-ui/icons/Tune";

import { commonTeamStyles } from "./common";
import TeamAlarmsContent from "./team-alarms-content";
import { Team, useTeam } from "../../lib/team";
import { Monitoring } from "../../models/monitoring";
import { useAlert } from "../utils/snackbar";

interface TeamAlarmsProps {
  team: Team,
  monitoring: Monitoring,
}

function TeamAlarms(props: TeamAlarmsProps): JSX.Element {
  const { team, monitoring } = props;
  const commonTeamClasses = commonTeamStyles();
  const { t } = useTranslation("yourloops");
  const teamHook = useTeam();
  const alert = useAlert();
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  const save = async (monitoring: Monitoring) => {
    team.remotePatientMonitoring = monitoring;
    setSaveInProgress(true);
    try {
      await teamHook.updateTeamAlerts(team);
      alert.success(t("team-update-success"));
    } catch (error) {
      console.error(error);
      alert.error(t("team-update-error"));
    } finally {
      setSaveInProgress(false);
    }
  };

  return (
    <div className={commonTeamClasses.root}>
      <div className={commonTeamClasses.categoryHeader}>
        <div>
          <TuneIcon />
          <Typography className={commonTeamClasses.title}>
            {t("events-configuration")}
          </Typography>
        </div>
      </div>

      <Box paddingX={3}>
        <TeamAlarmsContent monitoring={monitoring} onSave={save} saveInProgress={saveInProgress}/>
      </Box>
    </div>
  );
}

export default TeamAlarms;
