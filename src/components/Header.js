import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';

import * as actions from '../store/actions';

function Header(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const history = useHistory();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateLogIn = () => {
    setAnchorEl(null);
    history.push('/login');
  };

  const handleLogout = () => {
    setAnchorEl(null);
    props.dispatch(actions.authLogout());
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography component="h1" variant="h6" className={classes.title}>
          <Link to="/" className={classes.titleLink}>
            Laravel Material
          </Link>
        </Typography>

        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={handleClose}
          >
            {!props.isAuthenticated && (
              <MenuItem onClick={navigateLogIn}>Log In</MenuItem>
            )}
            {props.isAuthenticated && (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  titleLink: {
    color: theme.white,
    textDecoration: 'none',
    '&:hover': {
      color: theme.white,
      textDecoration: 'none'
    }
  }
}));

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Header);
