/* eslint-disable no-unused-vars */
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

import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";


import { AppBar, Breadcrumbs, Container, createStyles, Link, List, ListItem, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import HeaderBar from "../../components/primary-header-bar";
import { Notification } from "./notification";
import { INotification } from "../../lib/notifications/models";
import { useAuth } from "../../lib/auth";
import { useNotification } from "../../lib/notifications/hook";
import { errorTextFromException } from "../../lib/utils";

const useStyles = makeStyles((theme: Theme) =>
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
    typography: {
      textAlign: "center",
      margin: theme.spacing(4),
    },
  })
);

const NotificationHeader = () => {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  const { user } = useAuth();

  const homePage = useMemo(() => (`/${user?.role ?? ""}`),
    [user]
  );

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs
            aria-label={t("aria-breadcrumbs")}
            separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              component={RouterLink}
              to={homePage}
              className={classes.breadcrumbLink}
              color="textPrimary"
            >
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

const sortNotification = (notifA: INotification, notifB: INotification): number =>
  Date.parse(notifB.created) - Date.parse(notifA.created);

export const NotificationsPage = (): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  const { user } = useAuth();
  const notifications = useNotification();
  const [notifs, setNotifs] = React.useState<INotification[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  React.useEffect(() => {
    const loadNotifs = async () => {
      console.log("enter in useEffect");
      let results: INotification[];
      try {
        results = await notifications.getPendingInvitations(user?.userid);
        results.sort(sortNotification);
        setNotifs(results);
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        const message = t(errorMessage);
        console.log(message);
        //openSnackbar({ message, severity: AlertSeverity.error });
      }
    };

    loadNotifs();
  }, [notifications, user, t]);

  function handleRemove(id: string): void {
    const newList = notifs.filter((item) => item.id !== id);
    setNotifs(newList);
  }

  return (
    <Fragment>
      <NotificationHeader />
      <Container maxWidth="lg" style={{ marginTop: "1em" }}>
        <List>
          {notifs.length > 0 ? (
            notifs.map(({ id, created, creator, type, target }, index) => (
              <ListItem
                key={index}
                style={{ padding: "8px 0" }}
                divider={index !== notifs.length - 1}>
                <Notification
                  id={id}
                  created={created}
                  creator={creator}
                  type={type}
                  target={target}
                  onRemove={handleRemove}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              className={classes.typography}
              id="typography-no-pending-invitation-message"
              variant="body2"
              gutterBottom>
              {t("notification-no-pending-invitation")}
            </Typography>
          )}
        </List>
      </Container>
    </Fragment>
  );
};
