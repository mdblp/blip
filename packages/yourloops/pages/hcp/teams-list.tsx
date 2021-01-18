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
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from "@material-ui/icons/Home";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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
interface TeamElementProps {
  team: Team;
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

const teamPaperStyles = makeStyles((theme: Theme) => {
  return {
    paper: {
      display: "flex",
      flexDirection: "column",
    },
    paperRoot: {
      padding: "1em",
    },
    firstRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: theme.spacing(2),
    },
    secondRow: {
      display: "flex",
      flexDirection: "row",
    },
    teamName: {
      minWidth: "8em",
    },
    buttonActionFirstRow: {
      alignSelf: "center",
      marginRight: "1em",
    },
    divActions: {
      marginLeft: "2em",
      display: "flex",
      flexGrow: 1,
      justifyContent: "flex-start",
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

function TeamElement(props: TeamElementProps): JSX.Element {
  const { team } = props;
  const classes = teamPaperStyles();
  return (
    <Paper className={classes.paper} classes={{ root: classes.paperRoot }}>
      <div className={classes.firstRow}>
        <h2 className={classes.teamName}>{team.name}</h2>
        <div className={classes.divActions}>
          <Button
            id={`button-team-edit-${team.id}`}
            classes={{ root: classes.buttonActionFirstRow }}
            startIcon={<EditIcon color="primary" />}
          >
            {t("button-team-edit")}
          </Button>
          <Button
            id={`button-team-delete-${team.id}`}
            classes={{ root: classes.buttonActionFirstRow }}
            startIcon={<DeleteIcon color="primary" />}
          >
            {t("button-team-delete")}
          </Button>
          <Button
            id={`button-team-add-member-${team.id}`}
            classes={{ root: classes.buttonActionFirstRow }}
            startIcon={<PersonAddIcon color="primary" />}
          >
            {t("button-team-add-member")}
          </Button>
        </div>
      </div>
      <div className={classes.secondRow}></div>
    </Paper>
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
          <TeamElement team={team} />
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
