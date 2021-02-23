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
import { useTranslation } from "react-i18next";
import moment from "moment-timezone";

import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import { Button, createStyles, makeStyles } from "@material-ui/core";

import { MedicalServiceIcon } from "../../components/Icons/MedicalServiceIcon";
import { UserRoles } from "../../models/shoreline";

export enum NotificationType {
  dataShare,
  joinGroup,
}

export interface INotification {
  type: NotificationType;
  emitter: { role: UserRoles; firstName: string; lastName: string };
  date: string;
  target?: string;
}

interface NotificationProps {
  notification: INotification;
  userRole: UserRoles | undefined;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: { display: "flex", alignItems: "center", flex: "1 1 auto" },
    rightSide: { width: "350px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    notification: { marginLeft: "1em", flexGrow: 4 },
    button: { marginLeft: "1em" },
  })
);

export const Notification = ({ notification: { date, emitter, type, target }, userRole }: NotificationProps): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const { container, notification, rightSide, button } = useStyles();

  const notif: JSX.Element =
    type === NotificationType.dataShare ? (
      <span> {t("datashare")}</span>
    ) : (
      <span>
        {" "}
        {t("join-group")} <strong>{target}.</strong>
      </span>
    );

  return (
    <div className={container}>
      <div>{getIconToDisplay(userRole, emitter.role)}</div>
      <span className={notification}>
        <strong>
          {emitter.firstName} {emitter.lastName}
        </strong>
        {notif}
      </span>
      <div className={rightSide}>
        <div>{getDateToDisplay(date)}</div>
        <div>
          <Button className={button} variant="contained" color="primary">
            {t("accept")}
          </Button>
          <Button className={button} variant="contained" color="secondary">
            {t("decline")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const getIconToDisplay = (userRole: UserRoles | undefined, emitterRole: UserRoles): JSX.Element => {
  if (userRole === UserRoles.caregiver) {
    return <PersonIcon />;
  } else {
    return emitterRole === UserRoles.patient ? <MedicalServiceIcon /> : <GroupIcon />;
  }
};

const getDateToDisplay = (emittedDate: string): string => {
  const { t } = useTranslation("yourlooops");

  const currentDate = moment().utc();
  const date = moment(emittedDate).utc();
  const diff = currentDate.diff(date, "days");

  if (diff === 0) {
    return t("today");
  } else if (diff === 1) {
    return t("yesterday");
  } else {
    return date.format("L");
  }
};
