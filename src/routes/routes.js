import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Archive from '../pages/Archive';
import NoMatch from '../pages/NoMatch';

// Base url is set so routing still works when deployed
// to GitHub pages. You can remove the variable
// and use relative urls if you're deploying to a TLD.
const base = process.env.PUBLIC_URL || '/';

const routes = [
  {
    path: base,
    exact: true,
    auth: true,
    component: Dashboard,
    fallback: Home
  },
  {
    path: `${base}/login`,
    exact: true,
    auth: false,
    component: Login
  },
  {
    path: `${base}/register`,
    exact: true,
    auth: false,
    component: Register
  },
  {
    path: `${base}/forgot-password`,
    exact: true,
    auth: false,
    component: ForgotPassword
  },
  {
    path: `${base}/reset-password`,
    exact: true,
    auth: false,
    component: ResetPassword
  },
  {
    path: `${base}/archive`,
    exact: true,
    auth: true,
    component: Archive
  },
  {
    path: '',
    exact: false,
    auth: false,
    component: NoMatch
  }
];

export default routes;
