/**
 * Copyright (c) 2021, Diabeloop
 * Generic Primary Header Bar
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

import _ from "lodash";
import * as React from "react";
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { makeStyles, withStyles, Theme } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import NotificationsIcon from "@material-ui/icons/Notifications";

import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

import brandingLogo from "branding/logo.png";
import { useAuth } from "../lib/auth";
import { UserRoles, User } from "../models/shoreline";
import { getUserFirstName, getUserLastName } from "../lib/utils";
interface HeaderProps extends RouteComponentProps {
  children?: JSX.Element | JSX.Element[];
}

const toolbarStyles = makeStyles((theme: Theme) => ({
  toolBar: {
    backgroundColor: "var(--mdc-theme-surface, white)",
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: (props: HeaderProps) => (_.isEmpty(props.children) ? "auto auto" : "auto auto auto"),
    paddingLeft: "6em",
    paddingRight: "6em",
    paddingBottom: "1em",
    paddingTop: "0.5em",
  },
  toolbarRightSide: { display: "flex", justifyContent: "flex-end" },
  accountType: {
    fontWeight: "lighter",
  },
  toolbarLogo: {
    height: "45px",
    cursor: "pointer",
    outline: "none",
  },
  accountMenuIcon: { color: theme.palette.primary.main },
}));

/**
 * Create a custom account button.
 *
 * With a CSS style named "ylp-button-account"
 */
const AccountButton = withStyles((/* theme: Theme */) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    color: "var(--mdc-theme-on-surface, black)",
    textTransform: "none",
    fontWeight: "bold",
  },
}), { name: "ylp-button-account" })(Button);

function HeaderBar(props: HeaderProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = toolbarStyles(props);
  const auth = useAuth();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  const userRole = auth.user?.role ?? null;

  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onLogoClick = (): void => {
    history.push("/");
  };

  const handleCloseAccountMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenProfilePage = () => {
    history.push("/account-preferences");
  };

  const handleOpenNotifications = () => {
    history.push("/notifications");
  };

  const handleLogout = () => {
    const { history } = props;
    setAnchorEl(null);
    auth.logout();
    history.push("/");
  };

  let accountMenu = null;
  if (auth.isLoggedIn()) {
    const user: User = auth.user as User;
    const name = `${getUserFirstName(user)} ${getUserLastName(user)}`;

    accountMenu = (
      <React.Fragment>
        <AccountButton
          id="button-user-account-menu-appbar"
          aria-label={t("aria-current-user-account")}
          aria-controls="menu-user-account-appbar"
          aria-haspopup="true"
          endIcon={<ArrowDropDown className={classes.accountMenuIcon} />}
          onClick={handleOpenAccountMenu}>
          {name}
        </AccountButton>
        <Menu
          id="menu-user-account-appbar"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted={false}
          open={userMenuOpen}
          onClose={handleCloseAccountMenu}>
          <MenuItem
            id="menu-open-profile"
            onClick={handleOpenProfilePage}
            >{t("menu-account-preferences")}
          </MenuItem>
          <MenuItem
            id="menu-logout-yourloops"
            onClick={handleLogout}
            >{t("menu-logout")}
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <input
          type="image"
          className={classes.toolbarLogo}
          alt={t("alt-img-logo")}
          src={brandingLogo}
          onClick={onLogoClick} />
        {props.children}
        <div className={classes.toolbarRightSide}>
          {userRole && userRole !== UserRoles.patient && (
            <IconButton onClick={handleOpenNotifications}>
              <NotificationsIcon />
            </IconButton>
          )}
          {accountMenu}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(HeaderBar);
