import { QueryClient, QueryClientProvider } from "react-query";
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

import { muiThemes } from "./assets/styling/muiThemes";

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
import InventoryBooking from "./components/inventoryBooking/InventoryBooking";
// import InventoryMovements from "./components/inventoryDashboards/inventoryMovements/InventoryMovements";

// --- Purchase Orders
import POApprovalDashboard from "./components/purchaseOrders/POApprovalDashboard";
import POApproval from "./components/purchaseOrders/POApproval";

// --- Assembly
import JobsCellDB from "./components/assembly/assyPages/JobsCellDB";
import EmployeeCellPlanDnd from "./components/assembly/assyPages/EmployeeCellPlanDnd";
import ProductionBooking from "./components/assembly/assyPages/ProductionBooking";

// import EmployeeCellCurrentDB from "./components/assembly/assyPages/EmployeeCellCurrentDB";

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
import EmployeeJobPlanDnd from "./components/assembly/assyPages/EmployeeJobPlanDnd";
import EmployeeJobCurrentDnd from "./components/assembly/assyPages/EmployeeJobCurrentDnd";
import JobsCellDB from "./components/assembly/assyPages/JobsCellDB";
import JobsLineDB from "./components/assembly/assyPages/JobsLineDB";


// --- Automation
import AutomationStatusDashboard from "./components/automationStatusDB/AutomationStatusDB";

// --- General
import CellAssignmentCheck from "./components/general/CellAssignmentCheck";
import OpAssignment from "./components/general/ScanOperator";
/
import McCellDB from "./components/machineDashboards/CellDashboard";
import JobsDB from "./components/assembly/assyPages/JobsDB";
import JobsTable from "./components/assembly/assyComponents/JobsTable";



 */

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

//#region  THEME

const sistemaTheme = muiThemes.getSistemaTheme();
const queryClient = new QueryClient();
//link to se how old JSS is converted to below https://mui.com/material-ui/migration/migrating-from-jss/
//note css specificty is advised against, better to use in line sx or custom type

//#endregion

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={sistemaTheme}>
        <BrowserRouter>
          <Container maxWidth="false">
            {/* //false disables maxwidth setting */}
            <Box component={"section"}>
              <CssBaseline />
              <QueryClientProvider client={queryClient}>
                <SistemaHeader>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/Index" element={<Index />} />
                    <Route path="/Clock" element={<DigitalClock />} />
                    <Route path="/InvBooking" element={<InventoryBooking />} />
                    <Route path="/ShiftSchedule" element={<ShiftSchedule />} />
                    <Route path="/ThemesCheck" element={<ThemesCheck />} />
                    <Route
                      path="/PendingPOs/"
                      element={<POApprovalDashboard />}
                    />
                    <Route path="/PendingPOs/:poNum" element={<POApproval />} />
                    <Route
                      path="/Assembly/JobsCellDB"
                      element={<JobsCellDB />}
                    />

                    <Route
                      path="/Assembly/EmployeeCellPlanDnd"
                      element={<EmployeeCellPlanDnd />}
                    />
                    <Route
                      path="/Assembly/ProductionBooking"
                      element={<ProductionBooking />}
                    />
                  </Routes>
                </SistemaHeader>
              </QueryClientProvider>
            </Box>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
