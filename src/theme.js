import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontSize: 16,
    h1: {
      fontSize: "3rem",
      fontWeight: 300
    },
    h2: {
      fontSize: "2.2rem",
      fontWeight: 300
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 300,
      marginBottom: "1rem"
    },
    body1: {
      marginBottom: "1rem"
    }
  }
});

export default theme;
