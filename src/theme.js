import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  text: '#222',
  white: '#fff',
  bg1: '#F5F5F6',
  bg2: '#E1E2E1',
  palette: {
    primary: {
      light: '#b2fef7',
      main: '#80cbc4',
      dark: '#4f9a94',
      contrastText: '#222'
    },
    secondary: {
      light: '#e6ceff',
      main: '#b39ddb',
      dark: '#836fa9',
      contrastText: '#222'
    }
  },
  typography: {
    fontSize: 16,
    h1: {
      fontSize: '3rem',
      fontWeight: 300
    },
    h2: {
      fontSize: '2.2rem',
      fontWeight: 300
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 300,
      marginBottom: '1rem'
    },
    body1: {
      marginBottom: '1rem'
    }
  }
});

export default theme;
