/**
 * Copyright (c) 2020, Diabeloop
 * Patient data page
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

import * as React from 'react';
import { RouteComponentProps, globalHistory } from "@reach/router";
import bows from 'bows';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
// import AddCircle from '@material-ui/icons/AddCircle';

import { User } from "../../models/shoreline";
import appConfig from "../../lib/config";
import appApi, { apiClient } from "../../lib/api";
import { t } from "../../lib/language";
import Blip from "blip";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PatientDataProps extends RouteComponentProps {
}

interface PatientDataState {
  iframeLoaded: boolean;
  users: User[] | null;
  selectedUser: User | null;
}

interface PatientListProps {
  users: User[];
  selectedUser: User | null;
  onClickPatient: (user: User) => void;
}

const toolbarStyles = makeStyles((/* theme */) => ({
  toolBar: {
    backgroundColor: "var(--mdc-theme-surface, white)",
  },
  logoutButton: {
    color: "var(--mdc-theme-text-button-on-surface, black)",
    marginLeft: "auto",
    "&:hover": {
      color: "var(--mdc-theme-text-button-hover-on-surface, black)",
    },
  },
  logo: {
  },
}));

function PatientToolBar(): JSX.Element {
  const classes = toolbarStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <div className={classes.logo}>
          <img className="toolbar-logo" alt={t("Logo")} />
        </div>
        {/* <Typography variant="h6" className={classes.title}>
          Yourloops
        </Typography> */}
        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Button color="inherit">Login</Button> */}
        <Button className={classes.logoutButton} onClick={() => globalHistory.navigate("/")}>
          {t("Logout")}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function PatientsList(props: PatientListProps): JSX.Element {
  const items: JSX.Element[] = [];
  const { users, selectedUser, onClickPatient } = props;
  for (const user of users) {
    const userName = user.profile?.fullName ?? user.username;
    const onClick = () => {
      onClickPatient(user);
    };
    items.push((
      <ListItem
        button={true}
        key={user.userid}
        onClick={onClick}
        selected={user.userid === selectedUser?.userid}
      >
        <ListItemText primary={userName} />
      </ListItem>
    ));
  }

  return <List style={{ overflow: "scroll" }}>{items}</List>;
}

class PatientData extends React.Component<PatientDataProps, PatientDataState> {
  private log: Console;

  constructor(props: PatientDataProps) {
    super(props);

    this.log = bows('PatientData');

    this.state = {
      iframeLoaded: false,
      users: null,
      selectedUser: null,
    };

    this.onSelectPatient = this.onSelectPatient.bind(this);
  }

  public componentDidMount(): void {
    apiClient.getUserShares().then((users: User[]) => {
      this.setState({ users });
    }).catch((reason: unknown) => {
      this.log.error(reason);
    });
  }

  public render(): JSX.Element {
    const { users, selectedUser } = this.state;
    let listPatients: JSX.Element | null = null;

    if (users !== null) {
      listPatients = <PatientsList users={users} onClickPatient={this.onSelectPatient} selectedUser={selectedUser} />;
    }

    return (
      <div id="patient-data" style={{ display: "flex", flexDirection: "column", height: '100vh', overflow: "hidden" }}>
        <PatientToolBar />
        <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, overflowY: "scroll" }}>
          {listPatients}
          <Blip config={appConfig} api={appApi} />
        </div>
      </div>
    );
  }

  private onSelectPatient(user: User): void {
    this.log.info('Click on', user);
    this.setState({ selectedUser: user });
    apiClient.loadPatientData(user.userid).catch((reason: unknown) => {
      this.log.error(reason);
    });
  }

}

export default PatientData;
