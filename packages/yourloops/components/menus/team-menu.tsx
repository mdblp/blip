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
import { useHistory } from "react-router-dom";

import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import { Team, useTeam } from "../../lib/team";
import MenuLayout from "../layouts/menu-layout";
import TeamEditDialog from "../../pages/hcp/team-edit-dialog";
import { TeamEditModalContentProps } from "../../pages/hcp/types";
import { useAlert } from "../utils/snackbar";
import { useAuth } from "../../lib/auth";
import { UserRoles } from "../../models/shoreline";
import { getDirectShares, ShareUser } from "../../lib/share";

const classes = makeStyles((theme: Theme) => ({
  teamIcon: {
    marginRight: theme.spacing(2),
  },
  badge: {
    right: -8,
    color: theme.palette.common.white,
    backgroundColor: "var(--text-base-color)",
  },
  clickableMenu: {
    cursor: "pointer",
  },
  separator: {
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.divider,
    marginLeft: theme.spacing(1),
    marginTop: 2,
  },
}));

function TeamMenu(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { badge, teamIcon, clickableMenu, separator } = classes();
  const { teams, createTeam } = useTeam();
  const history = useHistory();
  const alert = useAlert();
  const authHook = useAuth();
  const session = authHook.session();
  const isUserHcp = authHook.user?.isUserHcp();
  const isUserPatient = authHook.user?.isUserPatient();
  const theme = useTheme();
  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only("xs"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [caregivers, setCaregivers] = React.useState<ShareUser[] | null>(null);
  const opened = !!anchorEl;

  const filteredTeams = teams.filter(team => team.code !== "private");
  const closeMenu = () => setAnchorEl(null);
  const [teamCreationDialogData, setTeamCreationDialogData] = React.useState<TeamEditModalContentProps | null>(null);

  React.useEffect(() => {
    if (caregivers === null && session !== null) {
      getDirectShares(session).then((value) => {
        setCaregivers(value);
      }).catch(() => {
        setCaregivers([]);
      });
    }
  }, [caregivers, session]);

  const redirectToTeamDetails = (teamId: string) => {
    history.push(`/teams/${teamId}`);
    closeMenu();
  };

  const onSaveTeam = async (createdTeam: Partial<Team> | null) => {
    if (createdTeam) {
      try {
        await createTeam(createdTeam as Team);
        alert.success(t("team-page-success-create"));
      } catch (reason: unknown) {
        alert.error(t("team-page-failed-create"));
      }
    }
    setTeamCreationDialogData(null);
  };

  const createCareTeam = () => {
    setTeamCreationDialogData({ team: null, onSaveTeam });
    closeMenu();
  };

  const redirectToCaregivers = () => {
    history.push("/caregivers");
    closeMenu();
  };

  return (
    <React.Fragment>
      <Box
        id="team-menu"
        display="flex"
        alignItems="center"
        className={clickableMenu}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <Badge
          id="team-menu-count-badge"
          badgeContent={filteredTeams.length}
          overlap="circular"
          className={teamIcon}
          classes={{ badge }}
        >
          <GroupOutlinedIcon />
        </Badge>
        {!isMobileBreakpoint &&
          <ArrowDropDownIcon />
        }
      </Box>
      <MenuLayout
        open={opened}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <ListSubheader>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption">
              {t("care-team-membership")}
            </Typography>
            <div className={separator} />
          </Box>
        </ListSubheader>

        {filteredTeams.length ?
          filteredTeams.map(team => (
            <ListItem
              key={team.id}
              id={`team-menu-list-item-${team.id}`}
              className="team-menu-list-item"
              button
              onClick={() => {
                redirectToTeamDetails(team.id);
              }}
            >
              <Box marginX={1}>•</Box>
              <Typography>{team.name}</Typography>
            </ListItem>
          ))
          :
          <ListItem>
            <Typography>{t("care-team-no-membership")}</Typography>
          </ListItem>
        }

        {isUserHcp &&
          <Box>
            <Box marginY={1}>
              <Divider variant="middle" />
            </Box>

            <MenuItem id="team-menu-teams-link" onClick={createCareTeam}>
              <ListItemIcon>
                <GroupOutlinedIcon />
              </ListItemIcon>
              <Typography>
                {t("new-care-team")}
              </Typography>
            </MenuItem>
          </Box>
        }
        {isUserPatient &&
          <Box>
            <ListSubheader>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption">
                  {t("my-caregivers")}
                </Typography>
                <div className={separator} />
              </Box>
            </ListSubheader>
            <MenuItem id="team-menu-caregivers-link" onClick={redirectToCaregivers}>
              <ListItemIcon>
                <GroupOutlinedIcon />
              </ListItemIcon>
              <Typography>
                {t("my-caregivers")}  ({caregivers?.length})
              </Typography>
            </MenuItem>
          </Box>
        }
      </MenuLayout>
      <TeamEditDialog teamToEdit={teamCreationDialogData} />
    </React.Fragment>
  );
}

export default TeamMenu;
