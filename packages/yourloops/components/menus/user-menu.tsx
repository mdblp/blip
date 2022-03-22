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

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CancelIcon from "@material-ui/icons/Cancel";
import ContactSupportOutlinedIcon from "@material-ui/icons/ContactSupportOutlined";
import FaceIcon from "@material-ui/icons/Face";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import StethoscopeIcon from "../icons/StethoscopeIcon";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import { UserRoles } from "../../models/shoreline";
import { useAuth } from "../../lib/auth";
import RoundedHospitalIcon from "../icons/RoundedHospitalIcon";
import config from "../../lib/config";
import metrics from "../../lib/metrics";
import MenuLayout from "../layouts/menu-layout";

const classes = makeStyles(() => ({
  clickableMenu: {
    cursor: "pointer",
  },
  svgIcon: {
    margin: "inherit",
  },
}));

function UserMenu(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { user, logout } = useAuth();
  const { svgIcon, clickableMenu } = classes();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const opened = !!anchorEl;

  const getRoleIcon = (): JSX.Element => {
    switch (user?.role) {
    case UserRoles.hcp:
      return <StethoscopeIcon />;
    case UserRoles.caregiver:
      return <RoundedHospitalIcon />;
    default:
      return <FaceIcon />;
    }
  };

  const closeMenu = () => setAnchorEl(null);

  const onClickSettings = () => {
    history.push("/preferences");
    closeMenu();
  };

  const onClickLogout = async () => {
    await logout();
    closeMenu();
  };

  const onClickSupport = () => {
    window.open(config.SUPPORT_WEB_ADDRESS, "_blank");
    closeMenu();
    metrics.send("support", "click_customer_service");
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        className={clickableMenu}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        {getRoleIcon()}
        <Box marginX={1}>
          <Typography>
            {`${user?.role === UserRoles.hcp ? "Dr" : ""} ${user?.fullName}`}
          </Typography>
        </Box>
        <ArrowDropDownIcon />
      </Box>
      <MenuLayout
        open={opened}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <MenuItem onClick={onClickSettings}>
          <ListItemIcon>
            <PermContactCalendarIcon className={svgIcon} />
          </ListItemIcon>
          <Typography>
            {t("profile-settings")}
          </Typography>
        </MenuItem>

        <MenuItem onClick={onClickSupport}>
          <ListItemIcon>
            <ContactSupportOutlinedIcon className={svgIcon} />
          </ListItemIcon>
          <Typography>
            {t("menu-contact-support")}
          </Typography>
        </MenuItem>

        <Box marginY={1}>
          <Divider variant="middle" />
        </Box>

        <MenuItem onClick={onClickLogout}>
          <ListItemIcon>
            <CancelIcon className={svgIcon} />
          </ListItemIcon>
          <Typography>
            {t("menu-logout")}
          </Typography>
        </MenuItem>
      </MenuLayout>
    </React.Fragment>
  );
}

export default UserMenu;
