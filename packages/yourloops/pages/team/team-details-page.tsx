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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Box from "@material-ui/core/Box";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { Team, useTeam } from "../../lib/team";
import BasicDropdown from "../../components/dropdown/basic-dropdown";
import TeamInformation from "../../components/team/team-information";
import TeamMembers from "../../components/team/team-members";
import { commonTeamStyles } from "../../components/team/common";
import { useAuth } from "../../lib/auth";
import TeamAlarms from "../../components/team/team-alarms";

const useStyles = makeStyles((theme: Theme) => ({
  activeLink: {
    color: theme.palette.primary.main,
  },
  disableRipple: {
    "paddingLeft": 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
    "color": theme.palette.common.black,
  },
  drawer: {
    position: "sticky",
    height: "200px",
    top: "80px",
  },
  drawerTitle: {
    "display": "flex",
    "alignItems": "center",
    "marginTop": "30px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  refElement: {
    scrollMarginTop: "70px",
  },
  separator: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
  },
  teamDetails: {
    maxWidth: "1140px",
    padding: "0 20px",
  },
  teamInformation: {
    marginTop: "32px",
  },
  title: {
    fontWeight: 600,
    lineHeight: "20px",
    textTransform: "uppercase",
  },
}));

function TeamDetailPage(): JSX.Element {
  const { getTeam, getMedicalTeams, getTeamWithAlerts } = useTeam();
  const classes = useStyles();
  const commonTeamClasses = commonTeamStyles();
  const paramHook = useParams();
  const history = useHistory();
  const authContext = useAuth();
  const { t } = useTranslation("yourloops");
  const { teamId } = paramHook as { teamId: string };
  const [dropdownData, setDropdownData] = useState<{ selectedTeam: Team | null, teamNames: string[] } | null>(
    { selectedTeam: null, teamNames: [] }
  );
  const [teamWithAlert, setTeamWithAlert] = useState<Team | null>(null);
  const [activeLink, setActiveLink] = useState<string>("information");
  const isUserHcp = authContext.user?.isUserHcp();

  const teamInformation = useRef<HTMLDivElement>(null);
  const teamMembers = useRef<HTMLDivElement>(null);
  const teamAlarms = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    setActiveLink(ref.current?.dataset.link as string);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refresh = useCallback(async () => {
    setDropdownData({
      selectedTeam: getTeam(teamId) as Team,
      teamNames: getMedicalTeams().map((team: Team) => team.name),
    });
    setTeamWithAlert(await getTeamWithAlerts(teamId));
  }, [getTeam, teamId, getMedicalTeams, getTeamWithAlerts]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const redirectToDashboard = () => {
    history.push("/");
  };

  const redirectToTeam = (selectedTeam: string) => {
    const teamToRedirectTo = getMedicalTeams().find((team: Team) => team.name === selectedTeam);
    history.push(`/teams/${teamToRedirectTo?.id}`);
  };

  return (
    <React.Fragment>
      {dropdownData?.selectedTeam &&
        <div>
          <Box display="flex" alignItems="center">
            <IconButton className={classes.disableRipple} onClick={redirectToDashboard}>
              <ArrowBackIcon />
            </IconButton>
            <GroupOutlinedIcon />
            <Box marginLeft={0.5} marginRight={2}>{t("team")}</Box>
            <BasicDropdown
              key={dropdownData.selectedTeam.name}
              id={"team-basic-dropdown"}
              defaultValue={dropdownData.selectedTeam.name}
              values={dropdownData.teamNames}
              onSelect={redirectToTeam}
            />
          </Box>
          <Box display="flex" justifyContent={isUserHcp}>
            {isUserHcp &&
              <div className={classes.drawer}>
                <div
                  role="link"
                  className={`${classes.drawerTitle} ${activeLink === "information" ? classes.activeLink : ""}`}
                  tabIndex={0}
                  onKeyDown={() => scrollTo(teamInformation)}
                  onClick={() => scrollTo(teamInformation)}
                >
                  <InfoOutlinedIcon className={commonTeamClasses.icon} />
                  <Typography className={classes.title}>
                    {t("information")}
                  </Typography>
                </div>
                <div
                  role="link"
                  className={`${classes.drawerTitle} ${activeLink === "members" ? classes.activeLink : ""}`}
                  tabIndex={0}
                  onClick={() => scrollTo(teamMembers)}
                  onKeyDown={() => scrollTo(teamMembers)}
                >
                  <GroupOutlinedIcon className={commonTeamClasses.icon} />
                  <Typography className={classes.title}>
                    {t("members")}
                  </Typography>
                </div>
                {teamWithAlert && teamWithAlert.remotePatientMonitoring &&
                  <div
                    role="link"
                    className={`${classes.drawerTitle} ${activeLink === "configuration" ? classes.activeLink : ""}`}
                    tabIndex={0}
                    onClick={() => scrollTo(teamAlarms)}
                    onKeyDown={() => scrollTo(teamAlarms)}
                  >
                    <DesktopMacIcon className={commonTeamClasses.icon} />
                    <Typography className={classes.title}>
                      {t("events-configuration")}
                    </Typography>
                  </div>
                }
              </div>
            }
            <Box display="flex" justifyContent="center" margin="auto">
              <div className={classes.teamDetails}>
                <div
                  ref={teamInformation}
                  data-link="information"
                  className={`${classes.teamInformation} ${classes.refElement}`}
                >
                  <TeamInformation team={dropdownData.selectedTeam} refreshParent={refresh} />
                </div>
                {isUserHcp &&
                  <div>
                    <div className={classes.separator} />
                    <div
                      ref={teamMembers}
                      data-link="members"
                      className={classes.refElement}
                    >
                      <TeamMembers team={dropdownData.selectedTeam} refreshParent={refresh} />
                    </div>
                    {teamWithAlert && teamWithAlert.remotePatientMonitoring &&
                      <div>
                        <div className={classes.separator} />
                        <div
                          ref={teamAlarms}
                          data-link="configuration"
                          className={classes.refElement}
                        >
                          <TeamAlarms team={teamWithAlert} monitoring={teamWithAlert.remotePatientMonitoring} />
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </Box>
          </Box>
        </div>
      }
    </React.Fragment>
  );
}

export default TeamDetailPage;
