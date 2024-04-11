import { createTheme } from "@mui/material/styles";
import {
  green,
  red,
   //TODO: remove yellow,
  blue,
  blueGrey,
  grey,
  amber,
  cyan
} from "@mui/material/colors";

export const muiThemes = {
  getShiftScheduleTableTheme: function () {
    const tableTheme = createTheme({
      ///mui palette themes https://mui.com/material-ui/customization/color/

      palette: {
        primary: {
          dark: grey[800], // "#424242",
          main: grey[600], //"#757575",
          light: grey[400], //"#BDBDBD",
          contrastText: grey[50], // "#FAFAFA",
        },
        //Secondary used for current and next jobs
        secondary: {
          dark: green[200], //RUNNING
          main: amber[200], //NEXT
          light: blue[200], //"#",
          contrastText: grey[50], //
        },
        error: {
          dark: red[200], //RUNNING
          main: red[200], //NEXT
          light: red[200], //"#",
          contrastText: grey[50], //
        },
        cells: {
          dark: blueGrey[800], //RUNNING
          main: blueGrey[400], //NEXT
          light: blueGrey[200], //"#",
          contrastText: blueGrey[50], //
        },
        toolChange:{

          dark: blue[800], //RUNNING
          main: blue[400], //NEXT
          light: blue[200], //"#",
          contrastText: grey[50], //
        },
        mbatchChange:{

          dark: cyan[800], //RUNNING
          main: cyan[400], //NEXT
          light: cyan[200], //"#",
          contrastText: grey[50], //
        }
      },
    });
    return tableTheme;
  },
};
