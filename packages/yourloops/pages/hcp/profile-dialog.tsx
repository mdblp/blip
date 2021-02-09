/**
 * Copyright (c) 2021, Diabeloop
 * HCPs patient modale
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

import { User } from "../../models/shoreline";
import React, { FunctionComponent } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface ProfileDialogProps {
  user: User;
  isOpen: boolean;
  handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: { padding: "1em 2em" },
    button: { margin: "2em 1em" },
    title: {
      textAlign: "center",
      color: theme.palette.primary.main,
    },
    inputTitle: { color: "black" },
    inputProps: { textAlign: "right", padding: "1em 2em" },
    listItems: {
      display: "flex",
      padding: 0,
    },
    listItemText: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    primaryListItemText: {
      // eslint-disable-next-line no-magic-numbers
      color: theme.palette.grey[600],
      fontSize: "14px",
    },
    secondaryListItemText: {
      // eslint-disable-next-line no-magic-numbers
      color: theme.palette.grey[800],
    },
  })
);

export const ProfileDialog: FunctionComponent<ProfileDialogProps> = ({ user, isOpen, handleClose }: ProfileDialogProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const mail = user?.emails ? user.emails[0] : "";
  const hbA1c = "8.5%"; // TODO
  const birthDate = user?.profile?.patient?.birthday?.split("T")[0];

  return (
    <Dialog fullWidth={true} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title} id="patient-dialog-title">
        {t("patient-profile")}
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="firstName"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("First name")}
              secondary={user.profile?.firstName}
            />
          </ListItem>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="lastname"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("Last name")}
              secondary={user.profile?.lastName}
            />
          </ListItem>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="birthDate"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("Date of birth")}
              secondary={birthDate}
            />
          </ListItem>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="mail"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("Email")}
              secondary={mail}
            />
          </ListItem>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="hbA1c"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("initial-hbA1c")}
              secondary={hbA1c}
            />
          </ListItem>
          <ListItem divider className={classes.listItems}>
            <ListItemText
              id="units"
              classes={{
                root: classes.listItemText,
                primary: classes.primaryListItemText,
                secondary: classes.secondaryListItemText,
              }}
              primary={t("units")}
              secondary={user?.settings?.units?.bg}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
