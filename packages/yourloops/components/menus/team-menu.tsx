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

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { makeStyles, Theme } from "@material-ui/core/styles";
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

const classes = makeStyles((theme: Theme) => ({
  clickableMenu: {
    cursor: "pointer",
  },
  svgIcon: {
    margin: "inherit",
  },
  teamIcon: {
    marginRight: theme.spacing(2),
  },
  badge: {
    right: -8,
    color: theme.palette.common.white,
    backgroundColor: "var(--text-base-color)",
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
  const { svgIcon, badge, teamIcon, clickableMenu, separator } = classes();
  const { teams } = useTeam();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const opened = !!anchorEl;

  const filteredTeams = useMemo<Team[]>(() => teams.filter(team => team.code !== "private"), [teams]);

  const closeMenu = () => setAnchorEl(null);

  const onClickTeamSettings = () => {
    history.push("/teams");
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
          className={teamIcon}
          classes={{ badge }}
        >
          <GroupOutlinedIcon />
        </Badge>
        <ArrowDropDownIcon />
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

        {filteredTeams.map(team => (
          <ListItem key={team.id} className="team-menu-list-item">
            <Box marginX={1}>•</Box>
            <Typography>{team.name}</Typography>
          </ListItem>
        ))}

        <Box marginY={1}>
          <Divider variant="middle" />
        </Box>

        <MenuItem onClick={onClickTeamSettings}>
          <ListItemIcon>
            <GroupOutlinedIcon className={svgIcon} />
          </ListItemIcon>
          <Typography>
            {t("care-team-settings")}
          </Typography>
        </MenuItem>
      </MenuLayout>
    </React.Fragment>
  );
}

export default TeamMenu;
