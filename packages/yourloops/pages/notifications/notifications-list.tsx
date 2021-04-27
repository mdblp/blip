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

import * as React from "react";
import bows from "bows";
import { useTranslation } from "react-i18next";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { HttpHeaderKeys } from "../../models/api";
import { UserRoles } from "../../models/shoreline";
import config from "../../lib/config";
import { useAuth } from "../../lib/auth";
import { useTeam } from "../../lib/team";
import { useSharedUser } from "../../lib/share";

import SecondaryHeaderBar from "./secondary-bar";
import { INotification } from "./models";
import { Notification } from "./notification";

interface NotificationsPageProps {
  defaultURL: string;
  withTeam?: boolean;
}

const log = bows("Notifications");

const sortNotification = (a: INotification, b: INotification) => Date.parse(a.created) - Date.parse(b.created);

const TeamNotificationPage = (props: { notifications: INotification[]; userRole: UserRoles; onRemove: (id: string) => void; }): JSX.Element => {
  const { notifications, userRole, onRemove } = props;
  const teamHook = useTeam();
  const [updated, setUpdated] = React.useState(false);
  const hookInitialized = teamHook.initialized;

  React.useEffect(() => {
    if (hookInitialized) {
      for (let i=0; i<notifications.length; i++) {
        const n = notifications[i];
        if (typeof n.careteam === "undefined") {
          n.careteam = teamHook.getTeam(n.teamId);
          log.debug("Update notification", i, n);
        }
      }
      setUpdated(true);
    }
  }, [hookInitialized]);

  if (!(hookInitialized && updated)) {
    return <List />;
  }

  const handleRemove = (key: string): void => {
    onRemove(key);
    setTimeout(() => teamHook.refresh(true), 50);
  };

  return (
    <List>
      {notifications.sort(sortNotification).map((notification: INotification, index: number) => {
      const { key } = notification;
      return (
        <ListItem id={`notification-item-${key}`} key={key} style={{ padding: "8px 0" }} divider={index !== notifications.length - 1}>
          <Notification userRole={userRole} notification={notification} onRemove={handleRemove} />
        </ListItem>
      );
      })}
    </List>
  );
};

const CareteamNotificationPage = (props: { notifications: INotification[]; userRole: UserRoles; onRemove: (id: string) => void; }): JSX.Element => {
  const { notifications, userRole, onRemove } = props;
  const [_sharedUsersContext, sharedUsersDispatch] = useSharedUser();

  const handleRemove = (key: string): void => {
    onRemove(key);
    setTimeout(() => sharedUsersDispatch({ type: "reset" }), 50);
  };

  return (
    <List>
      {notifications.sort(sortNotification).map((notification: INotification, index: number) => {
      const { key } = notification;
      return (
        <ListItem id={`notification-item-${key}`} key={key} style={{ padding: "8px 0" }} divider={index !== notifications.length - 1}>
          <Notification userRole={userRole} notification={notification} onRemove={handleRemove} />
        </ListItem>
      );
      })}
    </List>
  );
};



export const NotificationsPage = (props: NotificationsPageProps): JSX.Element => {
  const authHook = useAuth();
  const { t } = useTranslation("yourloops");
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotification = async () => {
      const session = authHook.session();
      if (session) {
        const { sessionToken, traceToken, user } = session;
        log.info("fetchInvitation()");

        const apiURL = new URL(`/confirm/invitations/${user.userid}`, config.API_HOST);
        const response = await fetch(apiURL.toString(), {
          method: "GET",
          headers: {
            [HttpHeaderKeys.traceToken]: traceToken,
            [HttpHeaderKeys.sessionToken]: sessionToken,
          },
        });

        if (response.ok) {
          const result = await response.json() as INotification[];
          log.debug("notification:", result);
          setNotifications(result);
        }
      }
    };

    fetchNotification().catch((reason: unknown) => {
      log.error(reason);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <React.Fragment>
        <SecondaryHeaderBar defaultURL={props.defaultURL} />
        <CircularProgress
          id="notification-page-loading-progress"
          disableShrink
          style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }}
        />
      </React.Fragment>
    );
  }

  if (authHook.user === null || notifications.length < 1) {
    return (
      <React.Fragment>
        <SecondaryHeaderBar defaultURL={props.defaultURL} />
        <Container maxWidth="lg" style={{ marginTop: "1em" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span>{t("notification-no-pending-invitation")}</span>
          </div>
        </Container>
      </React.Fragment>
    );
  }

  function handleRemove(key: string): void {
    const newList = notifications.filter((item) => item.key !== key);
    setNotifications(newList);
  }

  const userRole = authHook.user.role;
  let notificationList: JSX.Element;
  if (props.withTeam) {
    notificationList = <TeamNotificationPage userRole={userRole} notifications={notifications} onRemove={handleRemove} />;
  } else {
    notificationList = <CareteamNotificationPage userRole={userRole} notifications={notifications} onRemove={handleRemove} />;
  }
  return (
    <React.Fragment>
      <SecondaryHeaderBar defaultURL={props.defaultURL} />
      <Container maxWidth="lg" style={{ marginTop: "1em" }}>
        {notificationList}
      </Container>
    </React.Fragment>
  );
};
