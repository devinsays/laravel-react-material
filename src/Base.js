import React from 'react';
import { connect } from 'react-redux';
import { Box, Container, Grid } from '@material-ui/core';

import Header from './components/Header';

const Base = ({ children }) => (
  <Grid container direction="column" style={{ minHeight: '100%' }}>
    <Grid item>
      <Header />
    </Grid>
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{
        flexGrow: '1'
      }}
    >
      <Container maxWidth="lg">
        <Box px={2} py={4}>
          {children}
        </Box>
      </Container>
    </Grid>
  </Grid>
);

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Base);
