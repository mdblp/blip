/**
 * Copyright (c) 2020, Diabeloop
 * Login page
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
import { RouteComponentProps } from "@reach/router";
import bows from 'bows';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginProps extends RouteComponentProps {
}

interface LoginState {
  username: string;
  password: string;
  showPassword: boolean;
  loginFormStyles: string[];
}

/**
 * Login page
 */
class Login extends React.Component<LoginProps, LoginState> {
  private log: Console;

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      showPassword: false,
      loginFormStyles: ['stage-transition-container-variant'],
    };

    this.log = bows('Login');

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onClickShowPasswordVisibility = this.onClickShowPasswordVisibility.bind(this);
    this.onClickLoginButton = this.onClickLoginButton.bind(this);
    this.onClickForgotPassword = this.onClickForgotPassword.bind(this);
    this.onClickSignup = this.onClickSignup.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div id="login">

      </div>
    );
  }

  private onUsernameChange() {
    this.log.debug("onUsernameChange");
  }

  private onPasswordChange() {
    this.log.debug("onUsernameChange");
  }

  private onClickShowPasswordVisibility() {
    this.log.debug("onUsernameChange");
  }

  private onClickLoginButton() {
    this.log.debug("onUsernameChange");
  }

  private onClickForgotPassword() {
    this.log.debug("onUsernameChange");
  }

  private onClickSignup() {
    this.log.debug("onUsernameChange");
  }
}

export default Login;
