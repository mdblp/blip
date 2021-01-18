/**
 * Copyright (c) 2021, Diabeloop
 * Teams list for HCPs
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
import { RouteComponentProps } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";

import Alert from "@material-ui/lab/Alert";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";

import AddIcon from "@material-ui/icons/Add";

import { Team } from "../../models/team";
import { t } from "../../lib/language";
import apiClient from "../../lib/api";

interface TeamsListPageState {
  loading: boolean;
  errorMessage: string | null;
  teams: Team[];
}
interface BarProps {
  onCreateTeam: (name: string) => Promise<void>
}

const log = bows("TeamsListPage");

const pageBarStyles = makeStyles((theme: Theme) => {
  /* eslint-disable no-magic-numbers */
  return {
    toolBar: {
      display: "grid",
      gridTemplateRows: "auto",
      gridTemplateColumns: "auto auto auto",
      paddingLeft: theme.spacing(12),
      paddingRight: theme.spacing(12),
    },
    toolBarRight: {
      display: "flex",
    },
    buttonAddTeam: {
      marginLeft: "auto",
    },
  };
});

function AppBarPage(props: BarProps): JSX.Element {
  const classes = pageBarStyles();

  const handleOpenModalAddTeam = () => {
    props.onCreateTeam("");
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar className={classes.toolBar}>
        <div id="team-list-toolbar-item-left"></div>
        <div id="team-list-toolbar-item-middle"></div>
        <div id="team-list-toolbar-item-right" className={classes.toolBarRight}>
          <Button
            id="team-list-toolbar-add-team"
            color="primary"
            variant="contained"
            className={classes.buttonAddTeam}
            onClick={handleOpenModalAddTeam}
          >
            <AddIcon />&nbsp;{t("button-add-team")}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

/**
 * HCP page to manage teams
 */
class TeamsListPage extends React.Component<RouteComponentProps, TeamsListPageState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      loading: true,
      errorMessage: null,
      teams: [],
    };

    this.onCreateTeam = this.onCreateTeam.bind(this);
  }

  componentDidMount(): void {
    this.onRefresh();
  }

  render(): JSX.Element {
    const { loading, errorMessage } = this.state;

    if (loading) {
      return (
        <CircularProgress disableShrink style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
      );
    }
    if (errorMessage !== null) {
      return (
        <div id="div-api-error-message" className="api-error-message">
          <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>{errorMessage}</Alert>
          <Button id="button-api-error-message" variant="contained" color="secondary" onClick={this.onRefresh}>{t("button-refresh-page-on-error")}</Button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <AppBarPage onCreateTeam={this.onCreateTeam} />
      </React.Fragment>
    );
  }

  onRefresh(): void {
    this.setState({ loading: true, errorMessage: null }, async () => {
      try {
        const teams = await apiClient.fetchTeams();
        this.setState({ teams, loading: false });
      } catch (reason: unknown) {
        log.error("onRefresh", reason);
        let errorMessage: string;
        if (reason instanceof Error) {
          errorMessage = reason.message;
        } else {
          const s = new String(reason);
          errorMessage = s.toString();
        }
        this.setState({ loading: false, errorMessage });
      }
    });
  }

  async onCreateTeam(name: string): Promise<void> {
    log.info("Create team", name);
  }
}

export default TeamsListPage;
