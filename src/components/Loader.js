import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  loader: {
    color: theme.white
  }
}));

export default function Loader() {
  // Styles.
  const classes = useStyles();

  return (
    <CircularProgress size={24} thickness={4} className={classes.loader} />
  );
}
