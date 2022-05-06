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

import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { makeStyles, Theme } from "@material-ui/core/styles";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";

import { Team, useTeam } from "../../lib/team";
import BasicDropdown from "../../components/dropdown/basic-dropdown";
import TeamAlarms from "../../components/team/team-alarms";
import TeamInformation from "../../components/team/team-information";
import TeamMembers from "../../components/team/team-members";
import Typography from "@material-ui/core/Typography";
import { commonTeamStyles } from "../../components/team/common";
import { useAuth } from "../../lib/auth";
import { UserRoles } from "../../models/shoreline";

const useStyles = makeStyles((theme: Theme) => ({
  basicDropdown: {
    marginLeft: "15px",
    width: "180px",
  },
  body: {
    display: "flex",
    flexDirection: "row",
  },
  centerContent: {
    justifyContent: "center",
  },
  disableRipple: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    "color": theme.palette.common.black,
  },
  drawer: {
    minWidth: "370px",
    maxWidth: "400px",
    position: "sticky",
    height: "200px",
    top: "80px",
  },
  groupOutlinedIcon: {
    margin: "0px",
  },
  drawerTitle: {
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "marginTop": "30px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  refElement: {
    scrollMarginTop: "70px",
  },
  root: {
    display: "flex",
    flexDirection: "row",
  },
  separator: {
    border: "1px solid #C4C4C4",
    marginBottom: "50px",
    marginTop: "50px",
  },
  teamDetails: {
    maxWidth: "1030px",
  },
  teamInformation: {
    marginTop: "32px",
  },
  teamSelection: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    color: theme.palette.grey[800],
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "20px",
  },
}));

function TeamDetailPage(): JSX.Element {
  const { getTeam, getMedicalTeams } = useTeam();
  const classes = useStyles();
  const commonTeamClasses = commonTeamStyles();
  const paramHook = useParams();
  const history = useHistory();
  const authContext = useAuth();
  const { t } = useTranslation("yourloops");
  const { teamId } = paramHook as { teamId: string };
  const [dropdownData, setDropdownData] = React.useState<{ selectedTeam: Team | null, teamNames: string[] } | null>(
    { selectedTeam: null, teamNames: [] }
  );
  const isUserHcp = authContext.user?.role === UserRoles.hcp;
  const bodyClass = isUserHcp ? classes.body : `${classes.body} ${classes.centerContent}`;

  const teamInformation = useRef<HTMLDivElement>(null);
  const teamMembers = useRef<HTMLDivElement>(null);
  const teamAlarms = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refresh = useCallback(() => {
    setDropdownData({
      selectedTeam: getTeam(teamId) as Team,
      teamNames: getMedicalTeams().map((team: Team) => team.name),
    });
  }, [getTeam, teamId, getMedicalTeams]);

  React.useEffect(() => {
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
          <div className={classes.teamSelection}>
            <IconButton className={classes.disableRipple} disableTouchRipple={true} onClick={redirectToDashboard}>
              <ArrowBackIcon />
            </IconButton>
            <GroupOutlinedIcon className={classes.groupOutlinedIcon} />
            {t("team")}
            <div className={classes.basicDropdown}>
              <BasicDropdown
                key={dropdownData.selectedTeam.name}
                id={"team-basic-dropdown"}
                defaultValue={dropdownData.selectedTeam.name}
                values={dropdownData.teamNames}
                onSelect={redirectToTeam} />
            </div>
          </div>
          <div className={bodyClass}>
            {isUserHcp &&
              <div className={classes.drawer}>
                <div
                  role="link"
                  className={classes.drawerTitle}
                  tabIndex={0}
                  onKeyDown={() => scrollTo(teamInformation)}
                  onClick={() => scrollTo(teamInformation)}
                >
                  <InfoOutlinedIcon className={commonTeamClasses.icon} />
                  <Typography className={classes.title}>
                    {t("information").toUpperCase()}
                  </Typography>
                </div>
                <div
                  role="link"
                  className={classes.drawerTitle}
                  tabIndex={0}
                  onClick={() => scrollTo(teamMembers)}
                  onKeyDown={() => scrollTo(teamMembers)}
                >
                  <GroupOutlinedIcon className={commonTeamClasses.icon} />
                  <Typography className={classes.title}>
                    {t("members").toUpperCase()}
                  </Typography>
                </div>
                <div
                  role="link"
                  className={classes.drawerTitle}
                  tabIndex={0}
                  onClick={() => scrollTo(teamAlarms)}
                  onKeyDown={() => scrollTo(teamAlarms)}
                >
                  <DesktopMacIcon className={commonTeamClasses.icon} />
                  <Typography className={classes.title}>
                    {t("telemonitoring-alarms").toUpperCase()}
                  </Typography>
                </div>
              </div>
            }
            <div className={classes.teamDetails}>
              <div ref={teamInformation} className={`${classes.teamInformation} ${classes.refElement}`}>
                <TeamInformation team={dropdownData.selectedTeam} refreshParent={refresh} />
              </div>
              {isUserHcp &&
                <div>
                  <div className={classes.separator} />
                  <div ref={teamMembers} className={classes.refElement}>
                    <TeamMembers team={dropdownData.selectedTeam} refreshParent={refresh} />
                  </div>
                  <div className={classes.separator} />
                  <div ref={teamAlarms} className={classes.refElement}>
                    <TeamAlarms />
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  );
}

export default TeamDetailPage;
