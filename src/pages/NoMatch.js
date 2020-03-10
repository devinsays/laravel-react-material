import React from 'react';
import { Helmet } from 'react-helmet';

import { Typography } from '@material-ui/core';

const NoMatch = () => (
  <>
    <Helmet>
      <title>404 | Laravel Material</title>
    </Helmet>
    <Typography component="h2" variant="h1" align="center">
      404
    </Typography>
    <Typography align="center">No page found.</Typography>
  </>
);

export default NoMatch;
