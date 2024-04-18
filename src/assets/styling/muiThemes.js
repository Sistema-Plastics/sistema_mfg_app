import { createTheme } from "@mui/material/styles";
import {
  green,
  red,
  yellow,
  blue,
  blueGrey,
  grey,
  amber,
  cyan,
} from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { typographyClasses } from "@mui/material/Typography";

import { tableCellClasses } from "@mui/material/TableCell";

const sistColours = {
  "klipit-Main": "#0032A0",
  "klipit-Light": "#1976d2",
  "klipit-Dark": "",
  "klipit-Text": "#fafafa", //grey50
  "microwave-Main": "#C8102E",
  "microwave-Light": "",
  "klmicrowavepit-Dark": "",
  "microwave-Text": "#fafafa",
  "paper-Background": "#fff", //"#fcf6e4",
};

export const muiThemes = {
  getSistemaTheme: function () {
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
        toolChange: {
          dark: blue[800], //RUNNING
          main: blue[400], //NEXT
          light: blue[200], //"#",
          contrastText: grey[50], //
        },
        mbatchChange: {
          dark: cyan[800], //RUNNING
          main: cyan[400], //NEXT
          light: cyan[200], //"#",
          contrastText: grey[50], //
        },
        paper: {
          background: sistColours["paper-Background"],
        },
        action: {
          active: blue[500],
          visited: blue[500],
        },
        jobStatus: {
          running: green[500],
          nextjob: yellow[500],
          notrunning: red[200],
        },
        approveButton: { main: red[400], contrastText: grey[50] },
        rejectButton: { main: green[400], contrastText: grey[50] },
        sistema: {
          klipit: {
            main: sistColours["klipit-Main"],
            light: sistColours["klipit-Light"],
            dark: "",
            contrastText: sistColours["klipit-Text"],
          },
          microwave: {
            main: sistColours["microwave-Main"],
            light: "",
            dark: "",
            contrastText: sistColours["microwave-Text"],
          },
        },
      },

      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),

        body1: {
          color: sistColours["klipit-Text"],
        },

        tableCellHeading: {
          fontSize: "1rem",
          fontWeight: 400,
        },
        tableCellData: {
          fontSize: "1rem",
          fontWeight: 800,
        },
        allVariants: {
          color: sistColours["klipit-Light"],
        },
      },

      components: {
        MuiCssBaseline: {
          styleOverrides: `
            h1 {
              color: blue;
            }, 
            h3 {
              color: blue;
            }, 
          `,
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: sistColours["paper-Background"],

              // "&.Mui-focused": {
              //     backgroundColor: "yellow",
              //     color:'red'
              //   },
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: sistColours["klipit-Light"],
              color: sistColours["klipit-Text"],
            },
          },
        },

        MuiFormControl: {
          styleOverrides: {
            root: {
              // backgroundColor: "red",
            },
          },
        },

        MuiFormControlLabel: {
          //controls button backgrounds

          styleOverrides: {
            label: { placeSelf: "top" },

            root: ({ ownerState, theme }) => ({
              backgroundColor: theme.palette.sistema.klipit.light,
              color: theme.palette.sistema.klipit.contrastText,
              borderRadius: 5,

              paddingRight: 10,
              paddingLeft: 10,
              margin: 2,
            }),
          },
        },

        MuiButton: {
          styleOverrides: {
            root: {
              color: sistColours["klipit-Text"],
            },
          },
        },
        MuiButtonBase: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              backgroundColor: theme.palette.sistema.klipit.light,
              alignSelf: "end",
              color: sistColours["klipit-Text"],
              paddingLeft: 10,
              paddingRight: 10,
              margin: 0,
              // "&.Mui-focused": {
              //   backgroundColor: "yellow",
              //   color:'red'
              // },
            }),
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              backgroundColor: "transparent",
              color: sistColours["klipit-Text"],
            },
          },
        },

        MuiTab: {
          styleOverrides: {
            root: {
              color: grey[500],
              "&.Mui-selected": { color: sistColours["klipit-Text"] },
            },
          },
        },
        MuiFab: {
          styleOverrides: {
            root: { color: sistColours["klipit-Text"], margin: 1 },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: sistColours["klipit-Text"],
              "&.Mui-checked": {
                color: sistColours["klipit-Text"],
              },
            },
          },
        },
        MuiRadio: {
          styleOverrides: {
            root: {
              color: grey[50],
              "&.Mui-checked": {
                color: sistColours["klipit-Text"],
              },
            },
          },
        },

        MuiOutlinedInput: {
          // datepicker main box
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              ...(ownerState.variant === "contained" &&
                ownerState.color === "primary" && {
                  backgroundColor: "#202020",
                  color: "#fff",
                }),
              color: theme.palette.sistema.klipit.main,
              padding: 0,
              paddingLeft: 5,
              paddingRight: 10,
              margin: 0,
              "&.Mui-focused": {
                // backgroundColor: "yellow",
              },
            }),
          },
        },

        MuiFormLabel: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              //date picker text
              color: theme.palette.sistema.klipit.main,
              padding: 0,
              margin: 0,
              "&.Mui-focused": {
                //backgroundColor: "purple",
                color: theme.palette.sistema.klipit.main,
              },
            }),
          },
        },
        MuiGrid: {
          defaultProps: {
            // borderRadius: 10,
            // borderColor: "blue",
            // backgroundColor: "orange",
          },
          styleOverrides: {
            root: {},
          },
        },
        MuiInput: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              color: theme.palette.sistema.klipit.main,
            }),
          },
        },

        MuiInputBase: {
          styleOverrides: { root: { color: "white" } },
        },

        MuiTextField: {
          styleOverrides: {
            root: {
              flexGrow: 1,
              marginBottom: "0px",
            },

            shrink: true,
          },
        },
      },
    });
    return tableTheme;
  },
};

export const TableRowTypography = styled(Typography)(({ theme }) => ({
  [`&.${typographyClasses.h2}`]: {
    // backgroundColor: muiThemes.getSistemaTheme().palette.sistema.klipit.light,
    // color: muiThemes.getSistemaTheme().palette.sistema.klipit.main,
    // borderBottom: "none",
    // paddingBottom: 4,
    // paddingTop: 4,
    fontSize: "1.4rem",
    fontWeight: 600,
  },
  [`&.${typographyClasses.h3}`]: {
    padding: 5,
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  [`&.${typographyClasses.h4}`]: {
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    fontSize: "1rem",
  },

  [`&.${typographyClasses.tableCellData}`]: {
    color: "red", // muiThemes.getSistemaTheme().palette.sistema.klipit.main,
    fontSize: "1.2rem",
    fontWeight: 600,
  },

  [`&.${typographyClasses.body}`]: {
    fontSize: 14,
  },
}));

export const CellTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: muiThemes.getSistemaTheme().palette.primary.dark,
    color: muiThemes.getSistemaTheme().palette.primary.contrastText,
    borderBottom: "none",
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
