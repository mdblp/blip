/**
 * Copyright (c) 2020, Diabeloop
 * Patient data page
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import _ from "lodash";
import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { t } from "../lib/language";
import apiClient from "../lib/api";

import brandingLogo from "branding/logo.png";

interface HeaderProps {
  children?: JSX.Element | JSX.Element[];
}

const toolbarStyles = makeStyles({
  toolBar: {
    backgroundColor: "var(--mdc-theme-surface, white)",
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: (props: HeaderProps) => _.isEmpty(props.children) ? "auto auto" : "auto auto auto",
  },
  accountMenu: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    color: "var(--mdc-theme-on-surface, black)",
  },
  accountInfos: {
    textAlign: "center",
  },
  accountName: {
    fontWeight: "bold",
  },
  accountType: {
    fontWeight: "lighter",
  },
  toolbarLogo: {
    height: "45px",
  },
});

function HeaderBar(props: HeaderProps): JSX.Element {
  const classes = toolbarStyles(props);

  // Context menu for profile/logout
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    apiClient.logout();
  };

  let accountMenu = null;
  if (apiClient.isLoggedIn) {
    const user = apiClient.whoami;
    const role = user?.roles ? user.roles[0] : "unknown";
    accountMenu = (
      <div className={classes.accountMenu}>
        <div className={classes.accountInfos}>
          <div className={classes.accountName}>{`${user?.profile?.firstName} ${user?.profile?.lastName}`}</div>
          <div className={classes.accountType}>{role}</div>
        </div>
        <IconButton
          aria-label={t("aria-current-user-account")}
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>{t('Profile')}</MenuItem>
          <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <img className={classes.toolbarLogo} alt={t("alt-img-logo")} src={brandingLogo} />
        {props.children}
        {accountMenu}
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
