/**
 * Copyright (c) 2020, Diabeloop
 * Notification component
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

import React from "react";
import { useTranslation, Trans } from "react-i18next";
import moment from "moment-timezone";
import _ from "lodash";
import bows from "bows";

import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import MedicalServiceIcon from "../../components/icons/MedicalServiceIcon";
import { HttpHeaderKeys } from "../../models/api";
import { UserRoles, User } from "../../models/shoreline";
import { TeamMemberRole } from "../../models/team";
import config from "../../lib/config";
import { useAuth, Session } from "../../lib/auth";
import { getUserFirstName, getUserLastName } from "../../lib/utils";

import { INotification, NotificationType } from "./models";

interface NotificationProps {
  userRole: UserRoles;
  notification: INotification;
  onRemove: (id: string) => void;
};

interface NotificationDateProps {
  createdDate: string;
  id: string;
}

const log = bows("Notification");

async function acceptNotification(notification: INotification, session: Session): Promise<boolean> {
  const teamId = notification.careteam?.id;

  switch (notification.type) {
    case NotificationType.caregiverInvitation:
      {
        const { traceToken, sessionToken, user } = session;
        const apiURL = new URL(`/confirm/accept/invite/${user.userid}/${notification.creator.userid}`, config.API_HOST);
        const response = await fetch(apiURL.toString(), {
          method: "PUT",
          headers: {
            [HttpHeaderKeys.traceToken]: traceToken,
            [HttpHeaderKeys.sessionToken]: sessionToken,
          },
          body: JSON.stringify(notification),
        });
        if (response.ok) {
          return true;
        }
      }
      break;
    case NotificationType.teamMemberInvitation:
    case NotificationType.teamPatientInvitation:
      if (!_.isNil(teamId)) {
        const { traceToken, sessionToken, user } = session;
        const apiURL = new URL(`/confirm/accept/team/invite/${user.userid}/${teamId}`, config.API_HOST);
        const body = { ...notification };
        delete body.careteam;
        const response = await fetch(apiURL.toString(), {
          method: "PUT",
          headers: {
            [HttpHeaderKeys.traceToken]: traceToken,
            [HttpHeaderKeys.sessionToken]: sessionToken,
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          return true;
        }
      }
      break;
    default:
      log.error("Invalid notification type", notification);
      break;
  }
  return true;
}

async function declineNotification(notification: INotification, session: Session): Promise<boolean> {
  const teamId = notification.careteam?.id;

  switch (notification.type) {
    case NotificationType.caregiverInvitation:
      {
        const { traceToken, sessionToken, user } = session;
        const apiURL = new URL(`/confirm/dismiss/invite/${user.userid}/${notification.creator.userid}`, config.API_HOST);
        const response = await fetch(apiURL.toString(), {
          method: "PUT",
          headers: {
            [HttpHeaderKeys.traceToken]: traceToken,
            [HttpHeaderKeys.sessionToken]: sessionToken,
          },
          body: JSON.stringify(notification),
        });
        if (response.ok) {
          return true;
        }
      }
      break;
    case NotificationType.teamMemberInvitation:
    case NotificationType.teamPatientInvitation:
      if (!_.isNil(teamId)) {
        const { traceToken, sessionToken, user } = session;
        const apiURL = new URL(`/confirm/dismiss/team/invite/${user.userid}/${teamId}`, config.API_HOST);
        const body = { ...notification };
        delete body.careteam;
        const response = await fetch(apiURL.toString(), {
          method: "PUT",
          headers: {
            [HttpHeaderKeys.traceToken]: traceToken,
            [HttpHeaderKeys.sessionToken]: sessionToken,
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          return true;
        }
      }
      break;
    default:
      log.error("Invalid notification type", notification);
      break;
  }
  return true;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: { display: "flex", alignItems: "center", width: "100%" },
    rightSide: { width: "300px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    spanNotification: { marginLeft: "1em", flex: "1" },
    button: { marginLeft: "1em" },
  })
);

const getIcon = (userRole: UserRoles | undefined, memberRole: TeamMemberRole): JSX.Element => {
  if (userRole === UserRoles.caregiver) {
    return <PersonIcon />;
  }
  return memberRole === TeamMemberRole.patient ? <MedicalServiceIcon /> : <GroupIcon />;
};


const NotificationDate = ({ createdDate, id }: NotificationDateProps): JSX.Element => {
  const { t } = useTranslation("yourloops");
  // FIXME display at localtime ?
  const date = moment.utc(createdDate);
  const diff = moment.utc().diff(date, "days");
  const tooltip = date.format("LT");
  const ariaLabel = date.format("LLLL");

  let display: string;
  if (diff === 0) {
    display = t("today");
  } else if (diff === 1) {
    display = t("yesterday");
  } else {
    display = date.format("L");
  }

  return (
    <Tooltip title={tooltip} aria-label={ariaLabel} placement="bottom">
      <div id={`notification-date-${id}`}>{display}</div>
    </Tooltip>
  );
};

export const Notification = (props: NotificationProps): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const authHook = useAuth();
  const { container, spanNotification, rightSide, button } = useStyles();
  const [inProgress, setInProgress] = React.useState(false);

  const { userRole, notification, onRemove } = props;
  const id = notification.key;
  // const emitterName = getUserFirstLastName(notification.creator as User);
  const firstName = getUserFirstName(notification.creator as User);
  const lastName = getUserLastName(notification.creator as User);
  const careteam = notification.careteam?.name ?? "N/A";
  const values = {
    firstName,
    lastName,
    careteam,
  };

  const onAccept = async () => {
    setInProgress(true);
    const session = authHook.session();
    if (!_.isNil(session)) {
      try {
        await acceptNotification(notification, session);
      } catch (err) {
        log.error(err);
      }
    }
    setInProgress(false);
    onRemove(notification.key);
  };

  const onDecline = async () => {
    setInProgress(true);
    const session = authHook.session();
    if (!_.isNil(session)) {
      try {
        await declineNotification(notification, session);
      } catch (err) {
        log.error(err);
      }
    }
    setInProgress(false);
    onRemove(notification.key);
  };

  let notificationContent: JSX.Element | null = null;
  switch (notification.type) {
    case NotificationType.caregiverInvitation:
      notificationContent = (
        <Trans t={t} i18nKey="notification-caregiver-invitation-by-patient" components={{ strong: <strong /> }} values={values} parent={React.Fragment}>
          <strong>{firstName} {lastName}</strong> wants to share their diabetes data with you.
        </Trans>
      );
      break;
    case NotificationType.teamMemberInvitation:
      notificationContent = (
        <Trans t={t} i18nKey="notification-hcp-invitation-by-team" components={{ strong: <strong /> }} values={values} parent={React.Fragment}>
          <strong>{firstName} {lastName}</strong> invites you to join <strong>{careteam}</strong>.
        </Trans>
      );
      break;
    case NotificationType.teamPatientInvitation:
      notificationContent = (
        <Trans t={t} i18nKey="notification-patient-invitation-by-team" components={{ strong: <strong /> }} values={values} parent={React.Fragment}>
          You’re invited to share your diabetes data with <strong>{careteam}</strong>.
        </Trans>
      );
      break;
    default:
      notificationContent = <i>TODO Missing invitation type: {notification.type}</i>;
  }

  return (
    <div className={container}>
      <div>{getIcon(userRole, notification.role)}</div>
      <span className={spanNotification}>
        {notificationContent}
      </span>
      <div className={rightSide}>
        <NotificationDate createdDate={notification.created} id={id} />
        <div>
          <Button
            id={`notification-button-decline-${id}`}
            className={button}
            variant="contained"
            color="secondary"
            disabled={inProgress}
            onClick={onDecline}>
            {t("button-decline")}
          </Button>
          <Button
            id={`notification-button-accept-${id}`}
            color="primary"
            variant="contained"
            className={button}
            disabled={inProgress}
            onClick={onAccept}>
            {t("button-accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};
