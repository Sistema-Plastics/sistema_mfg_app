//import { QueryClient, QueryClientProvider } from "react-query";
//import { Connector } from "mqtt-react-hooks";
import "./App.css";
import React from "react";
import { blue, green, yellow, bluegrey, red, grey } from "@mui/material/colors";
import {
  //createBrowserRouter,
  BrowserRouter,
  //RouterProvider,
  Route,
  Routes,
  //Link,
} from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
/** 
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
 */

import "@fontsource/roboto";

//#region Import Components & Styles

//Style Sheets
import "./App.css";
import "./index.css";
import "./assets/styling/Element.css";

// --- Main Page
import Index from "./components/ProductionDBIndex";
import SistemaHeader from "./assets/components/SistemaHeader";

//General
// --- Digital Clock
import DigitalClock from "./assets/components/Clock";
import ThemesCheck from "./assets/components/ThemesCheck";

// --- Manufacturing
import ShiftSchedule from "./components/shiftSchedule/ShiftSchedule";

//#endregion

/**
// --- Digital Clock
import DigitalClock from "./assets/components/Clock";

// --- Manufacturing
import ShiftSchedule from "./components/shiftSchedule/ShiftSchedule";

// --- Assembly
import AssemblyNav from "./components/assembly/assyPages/Navigation";
import EmployeeCellCurrentDB from "./components/assembly/assyPages/EmployeeCellCurrentDB";
import EmployeeCellCurrentDnd from "./components/assembly/assyPages/EmployeeCellCurrentDnd";
import EmployeeCellPlanDnd from "./components/assembly/assyPages/EmployeeCellPlanDnd";
import EmployeeJobPlanDnd from "./components/assembly/assyPages/EmployeeJobPlanDnd";
import EmployeeJobCurrentDnd from "./components/assembly/assyPages/EmployeeJobCurrentDnd";
import JobsCellDB from "./components/assembly/assyPages/JobsCellDB";
import JobsLineDB from "./components/assembly/assyPages/JobsLineDB";
import InventoryBooking from "./components/inventoryBooking/InventoryBooking";
import InventoryMovements from "./components/inventoryDashboards/inventoryMovements/InventoryMovements";


// --- Automation
import AutomationStatusDashboard from "./components/automationStatusDB/AutomationStatusDB";

// --- General
import CellAssignmentCheck from "./components/general/CellAssignmentCheck";
import OpAssignment from "./components/general/ScanOperator";
// --- Purchase Orders
import POApprovalDashboard from "./components/purchaseOrders/POApprovalDashboard";
import POApproval from "./components/purchaseOrders/POApproval";
import McCellDB from "./components/machineDashboards/CellDashboard";
import JobsDB from "./components/assembly/assyPages/JobsDB";
import JobsTable from "./components/assembly/assyComponents/JobsTable";

const queryClient = new QueryClient();

 */

//#region  Help Links
/** 
+++++++++++++++++++++++++++++++++
model for design theme https://mui.com/material-ui/getting-started/templates/dashboard/

Link to how to use https://muhimasri.com/blogs/mui-textfield-colors-styles/#using-the-theme
how to customie elements https://mui.com/material-ui/customization/how-to-customize/ 

Colours https://mui.com/material-ui/customization/color/ 

typography theme viewer https://mui.com/material-ui/customization/default-theme/?expand-path=$.typography
++++++++++++++++++++++++++++++++++++++ 
 */

//#endregion

//#region Corp Colours
/**
 * Range / Collection Colour Hex Colour

KLIP IT™ Dark Blue (PMS 286C) #0032A0

KLIP IT PLUS™ Dark Blue (PMS 286C) #0032A0

BAKE IT™ Light Blue (PMS 7459C) #4298B5

Fresh™ Green #7ACC00

Ultra™ Black #000000

Brilliance™ Blue (PMS 3005C) #0077C8

TakeAlongs™ Dark Blue (PMS 286C) #0032A0

FreshWorks™ Dark Green (PMS 357C) #215732

Microwave™ Red (PMS 186C) #C8102E

TO GO™ Turquiose (PMS 7711C) #0097A9

Lunch™ Purple (PMS 2593C) #84329B

Hydrate™ Reflex Blue #001489

Home™ Aqua (PMS 570C) #6BCABA

Storage™ Dark Blue (PMS 286C) #0032A0

NEST IT™ Navy Blue (PMS 534C) #1C355E

Recycled Ocean Bound Plastic Recycled Teal (RGB 100 / 143 / 150) Reflex Blue (Logo on brown card) #648f96 #001689
 */

//#endregion

const sistemaTheme = createTheme({
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
    button: {},
  },
  palette: {
    paper: {
      background: "#fcf6e4",
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
    sistema: {
      klipit: { main: "#0032A0", light: "#1976d2", dark: "", contrastText: grey[50] },
      microwave:{ main:"#C8102E",light: "", dark: "", contrastText: grey[50]},
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        h1 {
          color: blue;
        }, 
      `,
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
        root:({ownerState,theme})=>(  {
          backgroundColor:theme.palette.sistema.klipit.light,
          color: theme.palette.sistema.klipit.contrastText,
          borderRadius: 10,
          paddingRight: 10,
          paddingLeft: 10,
          margin: 2,
        }),
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          backgroundColor: theme.palette.sistema.klipit.light,
          alignSelf: "end",

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
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: grey[50],
          "&.Mui-checked": {
            color: grey[400],
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: grey[50],
          "&.Mui-checked": {
            color: grey[400],
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
        root:({ownerState,theme})=>( {
          //date picker text
          color: theme.palette.sistema.klipit.main,
          padding: 0,
          margin: 0,
          "&.Mui-focused": {
            //backgroundColor: "purple",
            color:  theme.palette.sistema.klipit.main,
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

sistemaTheme.typography.body1 = { fontFamily: "Roboto" };
//link to se how old JSS is converted to below https://mui.com/material-ui/migration/migrating-from-jss/
//note css specificty is advised against, better to use in line sx or custom type

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={sistemaTheme}>
        <BrowserRouter>
          <Container maxWidth="false">
            {/* //false disables maxwidth setting */}
            <Box component={"section"}>
              <CssBaseline />
              <SistemaHeader>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/Index" element={<Index />} />
                  <Route path="/Clock" element={<DigitalClock />} />
                  <Route path="/ShiftSchedule" element={<ShiftSchedule />} />
                  <Route path="/ThemesCheck" element={<ThemesCheck />} />
                </Routes>
              </SistemaHeader>
            </Box>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
