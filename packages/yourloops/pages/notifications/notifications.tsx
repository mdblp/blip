/**
 * Copyright (c) 2020, Diabeloop
 * Notifications page
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

import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { AppBar, Breadcrumbs, createStyles, Link, makeStyles, Toolbar } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import HeaderBar from "../../components/header-bar";

const useStyles = makeStyles(() =>
  createStyles({
    homeIcon: {
      marginRight: "0.5em",
    },
    breadcrumbLink: {
      display: "flex",
    },
    toolBar: {
      display: "grid",
      gridTemplateRows: "auto",
      gridTemplateColumns: "auto auto auto",
      paddingLeft: "6em",
      paddingRight: "6em",
    },
  })
);

const NotificationHeader = () => {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs aria-label={t("breadcrumb")} separator={<NavigateNextIcon fontSize="small" />}>
            <Link className={classes.breadcrumbLink} color="textPrimary" href="/hcp">
              <HomeIcon className={classes.homeIcon} />
              {t("home")}
            </Link>
            <div>{t("notifications")}</div>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export const NotificationsPage = (): JSX.Element => {
  return (
    <div>
      <NotificationHeader />
      NOTIFICATIONS
    </div>
  );
};
