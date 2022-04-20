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

import { makeStyles, Theme } from "@material-ui/core/styles";

import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MedicalServiceIcon from "../icons/MedicalServiceIcon";
import PendingIcon from "../icons/PendingIcon";

interface MainDrawerProps {
  miniVariant?: boolean;
}

const defaultWidth = 240;
const miniVariantWidth = 57;

const styles = makeStyles((theme: Theme) => ({
  drawer: {
    width: defaultWidth,
    whiteSpace: "nowrap",
  },
  drawerPaper: {
    width: defaultWidth,
    overflowX: "hidden",
  },
  miniDrawer: {
    width: miniVariantWidth,
    whiteSpace: "nowrap",
  },
  miniDrawerPaper: {
    width: miniVariantWidth,
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
  const { drawer, drawerPaper, miniDrawer, miniDrawerPaper, enterTransition, leaveTransition } = styles();
  const { t } = useTranslation("yourloops");

  const [fullDrawer, setFullDrawer] = useState<boolean>(!miniVariant);
  const drawerClass = fullDrawer ? `${drawer} ${leaveTransition}` : `${miniDrawer} ${leaveTransition}`;
  const paperClass = fullDrawer ? `${drawerPaper} ${enterTransition}` : `${miniDrawerPaper} ${enterTransition}`;

  const drawerItems = [
    { icon: <SupervisedUserCircleIcon />, text: `${t("all-patients")} (104)` },
    { icon: <FlagOutlinedIcon />, text: `${t("flagged")} (12)` },
    { icon: <PendingIcon />, text: `${t("pending")} (7)` },
    { icon: <MedicalServiceIcon />, text: `${t("private-practice")} (4)` },
  ];

  const computeFullDrawer = (status: boolean) => {
    if (miniVariant) {
      setFullDrawer(status);
    }
  };

  useEffect(() => setFullDrawer(!miniVariant), [miniVariant]);

  return (
    <Drawer
      id="main-left-drawer"
      variant="permanent"
      className={drawerClass}
      classes={{ paper: paperClass }}
      onMouseEnter={() => computeFullDrawer(true)}
      onMouseLeave={() => computeFullDrawer(false)}
    >
      <Toolbar />
      <List>
        {drawerItems.map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText>
              {item.text}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default MainDrawer;

