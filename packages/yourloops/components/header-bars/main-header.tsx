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

import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";

import config from "../../lib/config";
import { useNotification } from "../../lib/notifications";
import { useAuth } from "../../lib/auth";
import { UserRoles } from "../../models/shoreline";
import RouterLink from "../utils/router-link";
import TeamMenu from "../menus/team-menu";
import UserMenu from "../menus/user-menu";

const classes = makeStyles((theme: Theme) => ({
  appBar: {
    borderBottom: "1px solid var(--text-base-color)",
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.common.white,
    color: "var(--text-base-color)",
  },
  desktopLogo: {
    width: 140,
  },
  separator: {
    height: 25,
    width: 1,
    backgroundColor: "var(--text-base-color)",
    margin: `0 ${theme.spacing(2)}px`,
  },
}));

function MainHeader(): JSX.Element {
  const { desktopLogo, separator, appBar } = classes();
  const { t } = useTranslation("yourloops");
  const { receivedInvitations } = useNotification();
  const { user } = useAuth();

  return (
    <AppBar elevation={0} className={appBar}>
      <Toolbar>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <RouterLink to="/">
            <Avatar
              variant="square"
              src={`/branding_${config.BRANDING}_logo.svg`}
              alt={t("alt-img-logo")}
              className={desktopLogo}
            />
          </RouterLink>

          <Box display="flex" alignItems="center">
            <RouterLink to="/notifications">
              <Badge badgeContent={receivedInvitations.length} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </RouterLink>
            <div className={separator} />
            {user?.role !== UserRoles.caregiver &&
              <React.Fragment>
                <TeamMenu />
                <div className={separator} />
              </React.Fragment>
            }
            <UserMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default MainHeader;
