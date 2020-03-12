import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import routes from './routes';
import PublicRoute from './Public';
import PrivateRoute from './Private';
import SplitRoute from './Split';

// This is config for GitHub Pages.
// If you are deploying to a top level domain,
// you can remove the basename prop from the Router.
const base = process.env.PUBLIC_URL || '/';

const Routes = () => (
  <Router basename={base}>
    <Switch>
      {routes.map(route => {
        if (route.auth && route.fallback) {
          return <SplitRoute key={route.path} {...route} />;
        } else if (route.auth) {
          return <PrivateRoute key={route.path} {...route} />;
        }
        return <PublicRoute key={route.path} {...route} />;
      })}
    </Switch>
  </Router>
);

export default Routes;
