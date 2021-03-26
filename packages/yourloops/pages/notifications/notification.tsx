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
import { TFunction, useTranslation } from "react-i18next";
import moment from "moment-timezone";

import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import { Button, createStyles, makeStyles } from "@material-ui/core";

import MedicalServiceIcon from "../../components/icons/MedicalServiceIcon";
import { UserRoles } from "../../models/shoreline";
import { INotification, NotificationType } from "../../lib/notifications/models";
import { errorTextFromException } from "../../lib/utils";
import { useNotification } from "../../lib/notifications/hook";

type NotificationProps = INotification & {
  userRole: UserRoles | undefined;
};

const useStyles = makeStyles(() =>
  createStyles({
    container: { display: "flex", alignItems: "center", width: "100%" },
    rightSide: { width: "300px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    notification: { marginLeft: "1em", flex: "1" },
    button: { marginLeft: "1em" },
  })
);

const getNotification = (type: NotificationType, t: TFunction<"yourloops">, target: string | undefined) =>
  type === NotificationType.directshare ? (
    <span> {t("datashare")}</span>
  ) : (
    <span>
      {" "}
      {t("join-group")} <strong>{target}.</strong>
    </span>
  );

const getIcon = (userRole: UserRoles | undefined, emitterRole: UserRoles): JSX.Element => {
  if (userRole === UserRoles.caregiver) {
    return <PersonIcon />;
  }

  return emitterRole === UserRoles.patient ? <MedicalServiceIcon /> : <GroupIcon />;
};

const getDate = (emittedDate: string, t: TFunction<"yourloops">): string => {
  const date = moment.utc(emittedDate);
  const diff = moment.utc().diff(date, "days");

  if (diff === 0) {
    return t("today");
  } else if (diff === 1) {
    return t("yesterday");
  }

  return date.format("L");
};

export const Notification = ({ created, creator, type, target, userRole }: NotificationProps): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const notifications = useNotification();
  const [inProgress, setInProgress] = React.useState(false);
  const { container, notification, rightSide, button } = useStyles();

  const onAccept = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // submit to api
    try {
      setInProgress(true);
      await notifications.accept(creator.userid, type);
      setInProgress(false);
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t(errorMessage);
      console.log(message);
      //openSnackbar({ message, severity: AlertSeverity.error });
    }
  };

  const onDecline = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // submit to api
    try {
      setInProgress(true);
      await notifications.decline(creator.userid, type);
      setInProgress(false);
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t(errorMessage);
      console.log(message);
      //openSnackbar({ message, severity: AlertSeverity.error });
    }
  };

  return (
    <div className={container}>
      <div>{getIcon(userRole, creator.role)}</div>
      <span className={notification}>
        <strong>
          {creator.profile.fullName}
        </strong>
        {getNotification(type, t, target)}
      </span>
      <div className={rightSide}>
        <div>{getDate(created, t)}</div>
        <div>
          <Button
            color="primary"
            variant="contained"
            className={button}
            disabled={inProgress}
            onClick={onAccept}
          >
            {t("accept")}
          </Button>
          <Button
            className={button}
            variant="contained"
            color="secondary"
            disabled={inProgress}
            onClick={onDecline}
          >
            {t("decline")}
          </Button>
        </div>
      </div>
    </div>
  );
};
