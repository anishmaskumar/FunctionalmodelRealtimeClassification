import React from "react";
import { Route, Redirect, Router, Switch } from "react-router-dom";
import asyncComponent from "./helpers/async-func";

const UnrestrictedRoute = ({
  component: Component,
  layoutSettings = {},
  ...rest
}) => (
    <Route
      {...rest}
      render={props =>
            <Component {...props} settings={layoutSettings} />
      }
    />
  );

const CommonRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
        <Redirect to="/devices" />
    }
  />
);

export default ({ history, user }) => {
  return (
    <Router history={history}>
      <Switch>
        <CommonRoute exact path={"/"} />
        <UnrestrictedRoute
          exact
          path={"/devices"}
          isLoggedIn={user}
          layoutSettings={{
            title: "Devices"
          }}
          component={asyncComponent(() =>
            import("./containers/devices/device-list")
          )}
        />
        <Route
          component={asyncComponent(() => import("./components/not-found"))}
        />
      </Switch>
    </Router>
  );
};
