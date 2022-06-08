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
import TimelineIcon from "@material-ui/icons/Timeline";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import FeedbackIcon from "@material-ui/icons/Feedback";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import HistoryIcon from "@material-ui/icons/History";

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

export const mainDrawerDefaultWidth = "300px";
export const mainDrawerMiniVariantWidth = "57px";

const styles = makeStyles((theme: Theme) => ({
  countLabel: {
    borderRadius: "50%",
    marginLeft: "auto",
    backgroundColor: theme.palette.primary.main,
    width: "24px",
    lineHeight: "24px",
    textAlign: "center",
    color: "white",
    fontSize: "14px",
  },
  monitoringBackgroundColor: {
    backgroundColor: theme.palette.warning.main,
  },
  monitoringFilters: {
    marginTop: 20,
  },
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
  monitoringTitleIcon: {
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
    countLabel,
    divider,
    drawer,
    drawerPaper,
    messagingTitle,
    monitoringBackgroundColor,
    monitoringFilters,
    monitoringTitleIcon,
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
  const patientFiltersStats = teamHook.patientsFilterStats;
  const numberOfFlaggedPatients = authHook.getFlagPatients().length;
  const loggedUserIsHcpInMonitoring = authHook.user?.isUserHcp() && teamHook.getRemoteMonitoringTeams().find(team => team.members.find(member => member.user.userid === authHook.user?.userid));

  const drawerClass = fullDrawer ? `${drawer} ${leaveTransition}` : `${miniDrawer} ${leaveTransition}`;
  const paperClass = fullDrawer || onHover ?
    `${drawerPaper} ${enterTransition} ${onHover && !fullDrawer ? drawerBoxShadow : ""}` :
    `${miniDrawerPaper} ${enterTransition}`;

  const drawerItems = [
    {
      icon: <SupervisedUserCircleIcon />,
      text: `${t("all-patients")} (${patientFiltersStats.all})`,
      filter: PatientFilterTypes.all,
    },
    {
      icon: <FlagOutlinedIcon />,
      text: `${t("flagged")} (${numberOfFlaggedPatients})`,
      filter: PatientFilterTypes.flagged,
    },
    {
      icon: <PendingIcon />,
      text: `${t("pending")} (${patientFiltersStats.pending})`,
      filter: PatientFilterTypes.pending,
    },
    {
      icon: <MedicalServiceIcon />,
      text: `${t("private-practice")} (${patientFiltersStats.directShare})`,
      filter: PatientFilterTypes.private,
    },
  ];

  const drawerEventsItems = [
    {
      icon: <HourglassEmptyIcon />,
      count: patientFiltersStats.outOfRange,
      text: t("time-away-from-target"),
      filter: PatientFilterTypes.outOfRange,
    },
    {
      icon: <TimelineIcon />,
      count: patientFiltersStats.severeHypoglycemia,
      text: t("alert-hypoglycemic"),
      filter: PatientFilterTypes.severeHypoglycemia,
    },
    {
      icon: <SignalWifiOffIcon />,
      count: patientFiltersStats.dataNotTransferred,
      text: t("data-not-transferred"),
      filter: PatientFilterTypes.dataNotTransferred,
    },
  ];

  useEffect(() => setFullDrawer(!miniVariant), [miniVariant]);

  return (
    <Drawer
      id="main-left-drawer"
      variant="permanent"
      className={drawerClass}
      classes={{ paper: paperClass }}
      onMouseEnter={() => miniVariant ? setOnHover(true) : undefined}
      onMouseLeave={() => miniVariant ? setOnHover(false) : undefined}
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
        {loggedUserIsHcpInMonitoring &&
          <Box bgcolor="var(--monitoring-filter-bg-color)" className={monitoringFilters}>
            <ListItem>
              <ListItemIcon>
                <DesktopMacIcon className={monitoringTitleIcon} />
              </ListItemIcon>
              <ListItemText>
                <Box className={messagingTitle}>
                  {t("remote-monitoring")}
                </Box>
              </ListItemText>
            </ListItem>
            <Link to={`/home?filter=${PatientFilterTypes.remoteMonitored}`}>
              <ListItem button>
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  <Box display="flex">
                    {t("monitored-patients")} ({patientFiltersStats.remoteMonitored})
                  </Box>
                </ListItemText>
              </ListItem>
            </Link>
            <Link to={`/home?filter=${PatientFilterTypes.renew}`}>
              <ListItem button>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText>
                  <Box display="flex">
                    {t("incoming-renewal")}
                    <Box className={`${countLabel} ${monitoringBackgroundColor}`}>
                      {patientFiltersStats.renew}
                    </Box>
                  </Box>
                </ListItemText>
              </ListItem>
            </Link>
            <Divider variant="middle" className={divider} />
            <ListItem>
              <ListItemIcon>
                <FeedbackIcon className={monitoringTitleIcon} />
              </ListItemIcon>
              <ListItemText>
                <Box className={messagingTitle}>
                  {t("events")}
                </Box>
              </ListItemText>
            </ListItem>
            {drawerEventsItems.map((item, index) => (
              <Link key={index} to={`/home?filter=${item.filter}`}>
                <ListItem button>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <Box display="flex">
                      {item.text}
                      <Box className={`${countLabel} ${monitoringBackgroundColor}`}>
                        {item.count}
                      </Box>
                    </Box>
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
            <Divider variant="middle" className={divider} />
            <ListItem>
              <ListItemIcon>
                <ContactMailIcon className={monitoringTitleIcon} />
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
                    {patientFiltersStats.unread > 0 &&
                      <Box className={countLabel}>
                        {patientFiltersStats.unread}
                      </Box>
                    }
                  </Box>
                </ListItemText>
              </ListItem>
            </Link>
          </Box>
        }
      </List>
    </Drawer>
  );
}

export default MainDrawer;

