import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import Routes from './routes';
import store from './store';
import theme from './theme';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Routes />
            </Switch>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
