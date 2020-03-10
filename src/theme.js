import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  text: '#222',
  white: '#fff',
  bg1: '#F5F5F6',
  bg2: '#E1E2E1',
  palette: {
    primary: {
      light: '#80b4ff',
      main: '#4285f4',
      dark: '#0059c1',
      contrastText: '#fff'
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
  },
  overrides: {
    MuiMenuItem: {
      root: {
        marginBottom: '0'
      }
    },
    MuiInputBase: {
      root: {
        marginBottom: '0'
      }
    }
  }
});

export default theme;
