/**
 * Copyright (c) 2022, Diabeloop
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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EmailIcon from "@material-ui/icons/Email";
import ContactMailIcon from "@material-ui/icons/ContactMail";

import MedicalServiceIcon from "../icons/MedicalServiceIcon";
import PendingIcon from "../icons/PendingIcon";
import { useTeam } from "../../lib/team";
import { useAuth } from "../../lib/auth";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { PatientFilterTypes } from "../../models/generic";

interface MainDrawerProps {
  miniVariant?: boolean;
}

export const mainDrawerDefaultWidth = "240px";
export const mainDrawerMiniVariantWidth = "57px";

const styles = makeStyles((theme: Theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  drawer: {
    width: mainDrawerDefaultWidth,
    whiteSpace: "nowrap",
  },
  drawerPaper: {
    width: mainDrawerDefaultWidth,
    overflowX: "hidden",
  },
  drawerBoxShadow: {
    boxShadow: theme.shadows[5],
  },
  messagingTitle: {
    fontWeight: 700,
    lineHeight: "20px",
    textTransform: "uppercase",
  },
  messagingTitleIcon: {
    color: theme.palette.grey[600],
  },
  miniDrawer: {
    width: mainDrawerMiniVariantWidth,
    whiteSpace: "nowrap",
  },
  miniDrawerPaper: {
    width: mainDrawerMiniVariantWidth,
    overflowX: "hidden",
  },
  enterTransition: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  leaveTransition: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

function MainDrawer({ miniVariant }: MainDrawerProps): JSX.Element {
  const {
    divider,
    drawer,
    drawerPaper,
    messagingTitle,
    messagingTitleIcon,
    miniDrawer,
    miniDrawerPaper,
    enterTransition,
    leaveTransition,
    drawerBoxShadow,
  } = styles();
  const { t } = useTranslation("yourloops");

  const [fullDrawer, setFullDrawer] = useState<boolean>(!miniVariant);
  const [onHover, setOnHover] = useState<boolean>(false);
  const teamHook = useTeam();
  const authHook = useAuth();
  const numberOfPatients = teamHook.getPatients().length;
  const numberOfFlaggedPatients = authHook.getFlagPatients().length;
  const numberOfPendingPatients = teamHook.getPendingPatients().length;
  const numberOfDirectSharePatients = teamHook.getDirectSharePatients().length;
  const numberOfPatientsWithUnreadMessages = teamHook.getUnreadMessagesPatients().length;

  const drawerClass = fullDrawer ? `${drawer} ${leaveTransition}` : `${miniDrawer} ${leaveTransition}`;
  const paperClass = fullDrawer || onHover ?
    `${drawerPaper} ${enterTransition} ${onHover && !fullDrawer ? drawerBoxShadow : ""}` :
    `${miniDrawerPaper} ${enterTransition}`;

  const drawerItems = [
    { icon: <SupervisedUserCircleIcon />, text: `${t("all-patients")} (${numberOfPatients})`, filter: PatientFilterTypes.all },
    { icon: <FlagOutlinedIcon />, text: `${t("flagged")} (${numberOfFlaggedPatients})`, filter: PatientFilterTypes.flagged },
    { icon: <PendingIcon />, text: `${t("pending")} (${numberOfPendingPatients})`, filter: PatientFilterTypes.pending },
    {
      icon: <MedicalServiceIcon />,
      text: `${t("private-practice")} (${numberOfDirectSharePatients})`,
      filter: PatientFilterTypes.private,
    },
  ];

  useEffect(() => setFullDrawer(!miniVariant), [miniVariant]);

  return (
    <Drawer
      id="main-left-drawer"
      variant="permanent"
      className={drawerClass}
      classes={{ paper: paperClass }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <Toolbar />
      <List>
        {drawerItems.map((item, index) => (
          <Link key={index} to={`/home?filter=${item.filter}`}>
            <ListItem button>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                {item.text}
              </ListItemText>
            </ListItem>
          </Link>
        ))}
        <Box bgcolor="var(--monitoring-filter-bg-color)">
          <Divider variant="middle" className={divider} />
          <ListItem>
            <ListItemIcon>
              <ContactMailIcon className={messagingTitleIcon} />
            </ListItemIcon>
            <ListItemText>
              <Box className={messagingTitle}>
                {t("messaging")}
              </Box>
            </ListItemText>
          </ListItem>
          <Link to={`/home?filter=${PatientFilterTypes.unread}`}>
            <ListItem button>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText>
                <Box display="flex">
                  {t("unread-messages")}
                  <Box borderRadius="50%" marginLeft={1} bgcolor="#00A3E2" width="24px" lineHeight="24px" textAlign="center" color="white" fontSize="14px">
                    {numberOfPatientsWithUnreadMessages}
                  </Box>
                </Box>
              </ListItemText>
            </ListItem>
          </Link>
        </Box>
      </List>
    </Drawer>
  );
}

export default MainDrawer;

