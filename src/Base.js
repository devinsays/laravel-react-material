import React from 'react';
import { connect } from 'react-redux';
import { Box, Container } from '@material-ui/core';

import Header from './components/Header';

const Base = ({ children }) => (
  <>
    <Header />
    <Container maxWidth="lg">
      <Box px={2} py={4}>
        {children}
      </Box>
    </Container>
  </>
);

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Base);
