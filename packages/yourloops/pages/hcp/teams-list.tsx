/**
 * Copyright (c) 2021, Diabeloop
 * Teams list for HCPs
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

import * as React from "react";
import bows from "bows";
import { useHistory, RouteComponentProps } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";

import Alert from "@material-ui/lab/Alert";
import AppBar from "@material-ui/core/AppBar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";

import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";

import { Team } from "../../models/team";
import { t } from "../../lib/language";
import apiClient from "../../lib/api";
import TeamCard from "./team-card";

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
    breadcrumbLink: {
      display: "flex",
    },
    homeIcon: {
      marginRight: "0.5em",
    },
    buttonAddTeam: {
      marginLeft: "auto",
    },
  };
});

function AppBarPage(props: BarProps): JSX.Element {
  const { onCreateTeam } = props;
  const classes = pageBarStyles();
  const history = useHistory();

  const handleClickMyTeams = (e: React.MouseEvent) => {
    e.preventDefault();
    history.push("/hcp/teams");
  };
  const handleOpenModalAddTeam = () => {
    onCreateTeam("");
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar className={classes.toolBar}>
        <div id="team-list-toolbar-item-left">
          <Breadcrumbs aria-label={t("breadcrumb")}>
            <Link color="textPrimary" className={classes.breadcrumbLink} href="/hcp/teams" onClick={handleClickMyTeams}>
              <HomeIcon className={classes.homeIcon} />
              {t("My Teams")}
            </Link>
          </Breadcrumbs>
        </div>
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
    const { loading, errorMessage, teams } = this.state;

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

    const teamsItems: JSX.Element[] = [];
    for (const team of teams) {
      teamsItems.push(
        <Grid item xs={12} key={team.id}>
          <TeamCard team={team} />
        </Grid>
      );
    }

    return (
      <React.Fragment>
        <AppBarPage onCreateTeam={this.onCreateTeam} />
        <Container maxWidth="lg" style={{ marginTop: "4em", marginBottom: "2em" }}>
          <Grid container spacing={3}>
            {teamsItems}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }

  onRefresh(): void {
    this.setState({ loading: true, errorMessage: null, teams: [] }, async () => {
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
