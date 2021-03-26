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

import * as React from "react";

import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import SecondaryHeaderBar from "./secondary-bar";
import { Notification } from "./notification";
import { INotification } from "../../lib/notifications/models";
import { useAuth } from "../../lib/auth";
import { useNotification } from "../../lib/notifications/hook";
import { errorTextFromException } from "../../lib/utils";

interface NotificationsPageProps {
  defaultURL: string;
}

const sortNotification = (
  notifA: INotification,
  notifB: INotification
): number => Date.parse(notifB.created) - Date.parse(notifA.created);

export const NotificationsPage = (props: NotificationsPageProps): JSX.Element => {
  const { user } = useAuth();
  const notifications = useNotification();
  const [notifs, setNotifs] = React.useState<INotification[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  React.useEffect(() => {
    const loadNotifs = async () => {
      console.log("enter in useEffect");
      let results: INotification[];
      try {
        results = await notifications.getInvitations(user?.userid);
        setNotifs(results);
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        const message = t(errorMessage);
        console.log("toto", message);
        //openSnackbar({ message, severity: AlertSeverity.error });
      }
    };

    loadNotifs();
  }, [notifications, user, t]);

  return (
    <React.Fragment>
      <SecondaryHeaderBar defaultURL={props.defaultURL} />
      <Container maxWidth="lg" style={{ marginTop: "1em" }}>
        <List>
          {notifs
            .sort(sortNotification)
            .map(({ created, creator, type, target }, index) => (
              <ListItem
                key={index}
                style={{ padding: "8px 0" }}
                divider={index !== notifs.length - 1}>
                <Notification
                  created={created}
                  creator={creator}
                  type={type}
                  target={target}
                  userRole={user?.role}
                />
              </ListItem>
            ))}
        </List>
      </Container>
    </React.Fragment>
  );
};
