import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import pink from "@material-ui/core/colors/pink";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

let theme = {};
  theme = {
    palette: {
        primary: blue,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
      }
    };

const muiTheme = createMuiTheme(theme);
export default ({ children }) => {
  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};
