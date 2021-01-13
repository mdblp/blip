// A wrapper for <Route> that redirects to the login

import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../lib/auth/hook/use-auth";

interface PrivateRouteProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any,
}

// screen if you're not yet authenticated.
function PrivateRoute( props : PrivateRouteProps ) : JSX.Element {
  const auth = useAuth();
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={( routeProps ) =>
        auth.isLoggedIn() ? (
          <Component {...routeProps} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: routeProps.location },
              }}
            />
        )
      }
    />
  );
}

export default PrivateRoute;
