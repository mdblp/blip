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

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBar, Breadcrumbs, Container, createStyles, Link, List, ListItem, makeStyles, Toolbar } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import HeaderBar from "../../components/header-bar";
import { Roles, User } from "../../models/shoreline";
import { useAuth } from "../../lib/auth/hook/use-auth";
import { INotification, Notification, NotificationType } from "./notification";

enum InvitationStatus {
  accepted = "accepted",
  rejected = "rejected",
}

const fakeNotif1: INotification = {
  date: new Date().toISOString(),
  emitter: { firstName: "Jean", lastName: "Dujardin", role: Roles.clinic },
  type: NotificationType.joinGroup,
  target: "Service de Diabétologie CH Angers",
};
const fakeNotif2: INotification = {
  date: "2021-02-18T10:00:00",
  emitter: { firstName: "Jeanne", lastName: "Dubois", role: Roles.patient },
  type: NotificationType.dataShare,
};
const fakeNotif3: INotification = {
  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday date
  emitter: { firstName: "Bob", lastName: "L'Eponge", role: Roles.clinic },
  type: NotificationType.joinGroup,
  target: "Crabe croustillant",
};

const getNotifications = (): Promise<INotification[]> => new Promise(() => [fakeNotif1, fakeNotif2, fakeNotif3]);

const acceptInvitation = (notification: INotification): Promise<void> => {
  console.log(notification);
  console.log(InvitationStatus.accepted);
  return new Promise(() => null);
};

const declineInvitation = (notification: INotification): Promise<void> => {
  console.log(notification);
  console.log(InvitationStatus.rejected);
  return new Promise(() => null);
};

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
  const { user } = useAuth();

  const homePage = useMemo(() => (user?.roles?.length && user.roles[0] === Roles.caregiver ? "/" : "/hcp/patients"), [
    // FIXME: set the route for caregiver
    user,
  ]);

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs aria-label={t("breadcrumb")} separator={<NavigateNextIcon fontSize="small" />}>
            <Link className={classes.breadcrumbLink} color="textPrimary" href={homePage}>
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
  Date.parse(notifB.date) - Date.parse(notifA.date);

export const NotificationsPage = (): JSX.Element => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    getNotifications().then((notifs) => setNotifications(notifs));
  }, []);

  const onAccept = (userid: User["userid"], notification: INotification): (() => void) => () => {
    console.log(userid, notification);
    acceptInvitation(notification).then(() => {
      setNotifications(notifications.filter((notif) => notif !== notification));
    });
  };
  const onDecline = (userid: User["userid"], notification: INotification): (() => void) => () => {
    console.log(userid, notification);
    declineInvitation(notification).then(() => {
      setNotifications(notifications.filter((notif) => notif !== notification));
    });
  };

  return (
    <Fragment>
      <NotificationHeader />
      {user && (
        <Container maxWidth="lg" style={{ marginTop: "1em" }}>
          <List>
            {notifications.sort(sortNotification).map((notification, index) => (
              <ListItem key={index} style={{ padding: "8px 0" }} divider={index !== notifications.length - 1}>
                <Notification
                  date={notification.date}
                  emitter={notification.emitter}
                  type={notification.type}
                  target={notification.target}
                  userRole={user?.roles && user.roles[0]}
                  onAccept={onAccept(user?.userid, notification)}
                  onDecline={onDecline(user?.userid, notification)}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      )}
    </Fragment>
  );
};
